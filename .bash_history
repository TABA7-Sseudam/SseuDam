npm install -g firebase-tools
firebase login
firebase logout
firebase login --no-localhost
mkdir my-firebase-project
cd my-firebase-project
firebase init
mkdir -p src/lib/firebase src/types
touch src/lib/firebase/config.ts
touch src/lib/firebase/db.ts
touch src/types/database.ts
nano firestore.rules
firebase deploy --only firestore:rules
nano firestore.indexes.json
firebase deploy --only firestore:indexes
firebase firestore:get /users/testuser1
firebase firestore:get /users
nano firestore.rules
firebase deploy --only firestore:rules
cd my-firebase-project
nano firebase.json
nano firestore.rules
firebase deploy --only firestore:rules
npm init -y
npm install firebase typescript @types/node
nano tsconfig.json
ts-node src/tests/testRegister.ts
npm install -g ts-node typescript
ts-node --version
ts-node src/tests/testRegister.ts
npm install tsconfig-paths --save-dev
ts-node -r tsconfig-paths/register src/tests/testRegister.ts
export NODE_PATH=./src
ts-node src/tests/testRegister.ts
ts-node -r tsconfig-paths/register src/tests/testRegister.ts
ls src/lib/firebase
ts-node -r tsconfig-paths/register src/tests/testRegister.ts
npm install dotenv
ts-node -r tsconfig-paths/register src/tests/testRegister.ts
rm -rf node_modules package-lock.json
npm install
ts-node -r tsconfig-paths/register src/tests/testRegister.ts
npm run test
firebase login
firebase projects:list
npm install
cd ~/MY-FIREBASE-PROJECT
ls
cd my-firebase-project
ls
npm install
npx ts-node src/tests/testLogin.ts
npm install typescript@latest
npx ts-node src/tests/testLogin.ts
npm install tsconfig-paths
npx ts-node -r tsconfig-paths/register src/tests/testLogin.ts
npx ts-node -r tsconfig-paths/register src/tests/testRegister.ts
npx ts-node -r tsconfig-paths/register src/tests/testLogin.ts
cd my-firebase-project
npm install -g firebase-tools
cd my-firebase-project
npx jest tests/testLogin.test.js
npm install --save-dev ts-jest @types/jest
cd my-firebase-project
ts-node src/tests/testLogin.ts
npm install -g ts-node
ts-node src/tests/testLogin.ts
npm install -D tsconfig-paths
npx ts-node -r tsconfig-paths/register src/tests/testLogin.ts
npx ts-node -r tsconfig-paths/register src/tests/testUpdateProfile.ts
firebase deploy --only firestore:rules
npm install -g firebase-tools
firebase deploy --only firestore:rules
rm -f firestore.rules
firebase deploy --only firestore:rules
cat firestore.rules
file -i firestore.rules
firebase deploy --only firestore:rules
cat firestore.rules
firebase deploy --only firestore:rules
cat firestore.rules
nano firestore.rules
cd my-firebase-project
firebase deploy --only firestore:rules
node test-login-register.js
npm install firebase
node test-login-register.js
node testRegister.js
ls -l
npm install -g ts-node
ts-node /home/yun777567/my-firebase-project/src/tests/testRegister.ts
firebase deploy --only firestore:rules
firebase emulators:start
firebase --version
npm install -g firebase-tools
firebase --version
firebase emulators:start
npm install -D @firebase/rules-unit-testing firebase-admin
npm install -D @firebase/rules-unit-testing firebase-admin --legacy-peer-deps
npm uninstall firebase
npm install firebase@10.7.1
rm -rf node_modules package-lock.json
cp package.json package.json.backup
npm install
npm install -D @firebase/rules-unit-testing firebase-admi
npm install -D @firebase/rules-unit-testing firebase-admin
npm run emulator
cd my-firebase-project
npm run test:rules
firebase emulators:start --clear
firebase emulators:start --clear
npm run test:rules -- --verbose
npm run emulator
firebase emulators:start --clear
rm -rf ~/.firebase/emulators/
npm run test:rules
firebase emulators:start
cd my-fire-project
git config --global user.name "LifeIsMoment"
git config --global user.email "crosefrog@naver.com"
git clone https://github.com/LifeIsMoment/TABA_7-_2-_frontend.git
gir add .
git add .
git status
git init
ls -la
git add .
git push origin firebase
git branch
git checkout -b firebase
