import updateNotifier, { UpdateNotifier } from 'update-notifier';

import pkg from '../minimal-package';

export async function handlePackageVersionUpdate() {
  try {
    const notifier: UpdateNotifier = updateNotifier({
      pkg,
      shouldNotifyInNpmScript: true
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // noinspection JSConstantReassignment
    notifier.update = await notifier.fetchInfo();
    
    if (notifier?.update?.type) {
      notifier.notify({
        defer: false,
        isGlobal: true,
        message: `'Update available ${notifier.update.current} → ${notifier.update.latest}
        Please run - 'npm i @mondaycom/apps-sdk' to update`,
      });
    }
  } catch (err) {
    console.log('Failed to check version in the NPM repository', { errorMessage: (err as Error).message });
  }
}
