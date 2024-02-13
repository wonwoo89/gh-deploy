import { exec, spawnSync } from 'child_process';
import { promisify } from 'util';
import inquirer from 'inquirer';

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
const echo = console.log;
const green = '\x1b[32m';
const noColor = '\x1b[0m';
const execute = promisify(exec);
const toFirstUpperCase = (str: string) => str.replace(/^\S/, ($1) => $1.toUpperCase());
const getBranchName = async () => {
  const { stdout } = await execute('git branch --show-current');
  return stdout.replace(/\n/gi, '').trim();
}
const runWorkflow = (deploymentTarget: DeploymentType, branch: string, inputs: { [key: string]: string | number }) => {
  echo();
  const inputArray = Object.entries(inputs).flatMap(([key, value]) => ['-f', `${key}=${value}`]);
  return spawnSync('gh', ['workflow', 'run', `Deployment to ${deploymentTarget}`, '--ref', branch, ...inputArray], {
    stdio: 'inherit',
  });
};

// main
(async () => {
  const currentBranch = await getBranchName();
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
      choices: (() => {
        echo(currentBranch);
        echo('> 브랜치 목록 최신화 하는 중...');
        echo();
        spawnSync('git', ['fetch', 'origin']);
        const remoteBranch = spawnSync('git', ['branch', '-r'], { encoding: 'utf8' })
          .stdout.split('\n')
          .map((b) => b.trim().replace('origin/', ''));
        return [currentBranch, ...remoteBranch];
      })(),
    },
  ]);

  if (environment === 'production') {
    if (version) {
      runWorkflow(DeploymentType.Production, currentBranch, { VERSION: version });
      echo();
      echo(`> 프로덕션 ${green}${toFirstUpperCase(version)} ${noColor}업데이트를 시작합니다.`);
      echo(`> 배포 브랜치: ${green}${currentBranch}`);
    }
    return;
  }

  runWorkflow(DeploymentType.Development, currentBranch, { environment });
  echo();
  echo(`> ${green}${toFirstUpperCase(environment)} ${noColor}환경 배포를 시작합니다.`);
  echo(`> 배포 브랜치: ${green}${currentBranch}`);
  return;
})();
