/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

/* File in use inside removed dir complete MAR file patch apply success test */

function run_test() {
  setupTestCommon();
  gTestFiles = gTestFilesCompleteSuccess;
  gTestDirs = gTestDirsCompleteSuccess;
  setupUpdaterTest(FILE_COMPLETE_MAR, false, true);

  let fileInUseBin = getApplyDirFile(gTestDirs[4].relPathDir +
                                     gTestDirs[4].subDirs[0] +
                                     gTestDirs[4].subDirFiles[0]);
  // Remove the empty file created for the test so the helper application can
  // replace it.
  fileInUseBin.remove(false);

  let helperBin = getTestDirFile(FILE_HELPER_BIN);
  let fileInUseDir = getApplyDirFile(gTestDirs[4].relPathDir +
                                     gTestDirs[4].subDirs[0]);
  helperBin.copyTo(fileInUseDir, gTestDirs[4].subDirFiles[0]);

  // Launch an existing file so it is in use during the update.
  let args = [getApplyDirPath() + "a/b/", "input", "output", "-s",
              HELPER_SLEEP_TIMEOUT];
  let fileInUseProcess = AUS_Cc["@mozilla.org/process/util;1"].
                         createInstance(AUS_Ci.nsIProcess);
  fileInUseProcess.init(fileInUseBin);
  fileInUseProcess.run(false, args, args.length);

  do_timeout(TEST_HELPER_TIMEOUT, waitForHelperSleep);
}

function doUpdate() {
  runUpdate(0, STATE_SUCCEEDED);
}

function checkUpdateApplied() {
  setupHelperFinish();
}

function checkUpdate() {
  checkFilesAfterUpdateSuccess();
  checkUpdateLogContains(ERR_BACKUP_DISCARD);
  checkCallbackAppLog();
}