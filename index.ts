import { exec } from 'child_process';
import { promisify } from 'util';
import inquirer from 'inquirer';
import inquirerSearchList from 'inquirer-search-list';
import * as path from "node:path";
import * as fs from "node:fs";

const targetEnvKey = 'DEPLOYMENT_ENV_LIST';
const parseEnv = (path: string) => {
  const env = fs.readFileSync(path, 'utf-8').split('\n').filter((path) => path.startsWith(targetEnvKey));
  if (!env.length) return null;
  const [, deploymentEnvironmentList] = env[0].split('=');
  return deploymentEnvironmentList.split(',');
}
const getDeploymentEnvironments = () => {
  const executionDir = process.cwd();
  const envLocalPath = path.resolve(executionDir, '.env.local');
  if (fs.existsSync(envLocalPath)) return parseEnv(envLocalPath);

  const envDevPath = path.resolve(executionDir, '.env.development');
  if (fs.existsSync(envDevPath)) return parseEnv(envDevPath);

  console.error(`파일을 찾을 수 없습니다`);
  return null;
};

const platformEnvironmentList = [
  'production',
  'staging',
  'test',
] as const;
const versionList = ['major', 'minor', 'patch'] as const;

enum DeploymentType {
  Production = 'production',
  Development = 'development',
}
type Version = (typeof versionList)[number];

// eslint-disable-next-line no-console
const echo = (str?: string) => console.log(str ? `> ${str}` : '');
const green = (str: string) => `\x1b[32m${str}`;
const noColor = (str: string) => `\x1b[0m${str}`;
const execute = promisify(exec);
const toFirstUpperCase = (str: string) => str.replace(/^\S/, ($1) => $1.toUpperCase());
const getBranchName = async () => {
  const { stdout } = await execute('git branch --show-current');
  return stdout.replace(/\n/gi, '').trim();
}
const getBranchList = async () => {
  const { stdout } = await execute('git branch -r');
  return stdout.split('\n').map((b) => b.trim().replace('origin/', ''));
}
const runWorkflow = (deploymentTarget: DeploymentType, branch: string, inputs?: { [key: string]: string | number }) => {
  echo();
  const inputArray = inputs ? Object.entries(inputs).flatMap(([key, value]) => ['-f', `${key}=${value}`]) : [];
  return execute(`gh workflow run "Deployment to ${deploymentTarget}" --ref ${branch} ${inputArray.join(' ')}`);
};

inquirer.registerPrompt('search-list', inquirerSearchList);

// main
(async () => {
  const currentBranch = await getBranchName();
  const { stdout } = await execute('pwd');
  const isPlatformProject = stdout.includes('platform');

  const env = getDeploymentEnvironments();
  if (!env) {
    return echo('환경 변수를 불러오지 못했습니다.');
  }

  const environmentList = ['production', 'staging', ...env];

  echo('브랜치 목록 최신화 하는 중...');
  echo();
  await execute('git fetch origin');
  const remoteBranch = await getBranchList();

  const { environment, version, branch } = await inquirer.prompt<{
    environment: string;
    version?: Version;
    branch: string;
  }>([
    {
      type: 'search-list',
      name: 'environment',
      message: '환경을 선택해주세요.(검색 가능)',
      default: 'staging',
      choices: isPlatformProject ? platformEnvironmentList : environmentList,
    },
    {
      type: 'list',
      name: 'version',
      message: '버전을 선택해주세요.',
      default: 'patch' as Version,
      choices: versionList,
      when: ({ environment }: { environment: string }) => environment === 'production',
    },
    {
      type: 'search-list',
      name: 'branch',
      message: '브랜치를 선택해주세요.(검색 가능)',
      default: currentBranch,
      choices: [currentBranch, ...remoteBranch],
    },
  ]);

  if (!branch) {
    return echo('선택된 브랜치가 없습니다.');
  }

  echo();
  if (environment !== 'production') {
    if (isPlatformProject) {
      await runWorkflow(environment as DeploymentType, branch);
    } else {
      await runWorkflow(DeploymentType.Development, branch, { environment });
    }
    echo(`${green(toFirstUpperCase(environment))} ${noColor('환경 배포를 시작합니다.')}`);
    echo(`배포 브랜치: ${green(branch)}`);
    return;
  }

  if (!version) {
    return echo('선택된 버전이 없습니다.');
  }

  await runWorkflow(DeploymentType.Production, branch, { VERSION: version });
  echo(`프로덕션 ${green(toFirstUpperCase(version))} ${noColor('업데이트를 시작합니다.')}`);
  echo(`배포 브랜치: ${green(branch)}`);
})();
