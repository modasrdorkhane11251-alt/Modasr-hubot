import { validateMediaUrl, handleUniversalDownloader } from '../src/services/botEngine';
import { fetchUniversalDownload } from '../src/services/realApis';

console.log('========================================');
console.log('RUNNING SLOWMEGABOT DOWNLOADER TEST SUITE');
console.log('========================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    console.error(`  [FAIL] ${testName}`);
  }
}

// Test 1: Direct MP4 link
console.log('1. Testing Direct MP4 Link Validation & Extraction:');
const directUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
const v1 = validateMediaUrl(directUrl);
assert(v1.isValid === true, 'Direct MP4 URL should be valid');
const res1 = fetchUniversalDownload(directUrl);
assert(res1.success === true, 'Direct MP4 download item should be successful');
assert(res1.contentType === 'video', 'Content type should be video');

// Test 2: Public Instagram link
console.log('\n2. Testing Public Instagram Link Validation & Extraction:');
const instaUrl = 'https://www.instagram.com/reel/DeeiCBGgKjr/?dlrf=eXNrbDlzZWcybXV1';
const v2 = validateMediaUrl(instaUrl);
assert(v2.isValid === true, 'Instagram Reel URL should be valid');
const res2 = fetchUniversalDownload(instaUrl);
assert(res2.success === true, 'Instagram download item should succeed');
assert(res2.platform === 'instagram', 'Platform should be detected as instagram');

// Test 3: Invalid URL format
console.log('\n3. Testing Invalid URL Handling:');
const invalidUrl = 'not-a-valid-url';
const v3 = validateMediaUrl(invalidUrl);
assert(v3.isValid === false, 'Invalid string should not be a valid media URL');

// Test 4: Expired / 404 / Private URL
console.log('\n4. Testing Expired / 404 / Private URL Handling:');
const expiredUrl = 'https://www.instagram.com/p/private_expired_123/';
const v4 = validateMediaUrl(expiredUrl);
assert(v4.isValid === false, 'Expired or private URL should be flagged as invalid');
assert(v4.reason?.includes('expired') || v4.reason?.includes('private') || false, 'Reason should indicate expiry or privacy');

// Test 5: Missing URL in message
console.log('\n5. Testing Message Without URL:');
const dummyUser = { id: 12345, first_name: 'TestUser' };
const respNoUrl = handleUniversalDownloader(12345, dummyUser, 'سلام ربات عزیز بدون لینک');
assert(respNoUrl.length > 0, 'Should return prompt for URL');
assert(respNoUrl[0].text.includes('لطفاً لینک خودتون رو ارسال کنید'), 'Prompt should ask for URL');

// Test 6: Multiple URLs in message
console.log('\n6. Testing Message With Multiple URLs:');
const multiMsg = 'ببین این دوتا ویدیو چقدر خوبند https://www.youtube.com/watch?v=dQw4w9WgXcQ و همچنین https://www.tiktok.com/@user/video/123';
const respMulti = handleUniversalDownloader(12345, dummyUser, multiMsg);
assert(respMulti.length > 0, 'Should successfully process message with multiple URLs');

console.log('\n========================================');
console.log(`TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED.`);
console.log('========================================');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  process.exit(0);
}
