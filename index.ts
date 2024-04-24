import { exec } from 'child_process';
import { promisify } from 'util';
import inquirer from 'inquirer';
import inquirerSearchList from 'inquirer-search-list';

const environmentList = [
  'production',
  'staging',
  'test-1',
  'test-2',
  'test-3',
  'test-4',
  'test-tm',
  'test-seo',
  'qa',
  'design',
] as const;
const versionList = ['major', 'minor', 'patch'] as const;

type EnvironmentType = (typeof environmentList)[number];
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
const runWorkflow = (deploymentTarget: DeploymentType, branch: string, inputs: { [key: string]: string | number }) => {
  echo();
  const inputArray = Object.entries(inputs).flatMap(([key, value]) => ['-f', `${key}=${value}`]);
  return execute(`gh workflow run "Deployment to ${deploymentTarget}" --ref ${branch} ${inputArray.join(' ')}`);
};

inquirer.registerPrompt('search-list', inquirerSearchList);

// main
(async () => {
  const currentBranch = await getBranchName();
  echo('> 브랜치 목록 최신화 하는 중...');
  echo();
  await execute('git fetch origin');
  const remoteBranch = await getBranchList();

  const { environment, version, branch } = await inquirer.prompt<{
    environment: EnvironmentType;
    version?: Version;
    branch: string;
  }>([
    {
      type: 'list',
      name: 'environment',
      message: '환경을 선택해주세요.',
      choices: environmentList,
    },
    {
      type: 'list',
      name: 'version',
      message: '버전을 선택해주세요.',
      default: 'patch' as Version,
      choices: versionList,
      when: ({ environment }: { environment: EnvironmentType }) => environment === 'production',
    },
    {
      type: 'search-list',
      name: 'branch',
      message: '브랜치를 선택해주세요.(검색 가능)',
      default: currentBranch,
      choices: [currentBranch, ...remoteBranch],
    },
  ]);

  if (environment === 'production') {
    if (version) {
      runWorkflow(DeploymentType.Production, branch, { VERSION: version });
      echo();
      echo(`> 프로덕션 ${green}${toFirstUpperCase(version)} ${noColor}업데이트를 시작합니다.`);
      echo(`> 배포 브랜치: ${green}${branch}`);
    }
    return;
  }

  runWorkflow(DeploymentType.Development, branch, { environment });
  echo();
  echo(`> ${green}${toFirstUpperCase(environment)} ${noColor}환경 배포를 시작합니다.`);
  echo(`> 배포 브랜치: ${green}${branch}`);
  return;
})();
