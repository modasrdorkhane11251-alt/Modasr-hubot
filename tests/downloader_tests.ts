import { validateMediaUrl, handleUniversalDownloader } from '../src/services/botEngine';
import { fetchUniversalDownload, stripTrackingParams, normalizeShortenedUrl } from '../src/services/realApis';

console.log('========================================');
console.log('RUNNING SLOWMEGABOT DOWNLOADER & TRACKING STRIPPING TEST SUITE');
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
assert(Boolean(res1 && res1.url), 'Direct MP4 download item should return valid item');
assert(res1.contentType === 'video', 'Content type should be video');

// Test 2: Public Instagram link with tracking tags (?igsh=...&utm_source=...)
console.log('\n2. Testing Public Instagram Link & Tracking Tag Stripping:');
const instaUrlWithTracking = 'https://www.instagram.com/reel/DeeiCBGgKjr/?igsh=eXNrbDlzZWcybXV1&utm_source=ig_web_button_share_sheet&utm_medium=referral';
const strippedIg = stripTrackingParams(instaUrlWithTracking);
assert(!strippedIg.includes('igsh') && !strippedIg.includes('utm_source'), 'Tracking parameters (igsh, utm_source) must be stripped');
const v2 = validateMediaUrl(instaUrlWithTracking);
assert(v2.isValid === true, 'Instagram Reel URL with tracking tags should be valid');
const res2 = fetchUniversalDownload(instaUrlWithTracking);
assert(Boolean(res2 && res2.url), 'Instagram download item should return valid item');
assert(res2.platform === 'instagram', 'Platform should be detected as instagram');

// Test 3: Shortened YouTube and TikTok links
console.log('\n3. Testing Shortened URL Resolution & Platform Detection:');
const ytShort = 'https://youtu.be/dQw4w9WgXcQ?si=123456&utm_source=share';
const normYt = normalizeShortenedUrl(stripTrackingParams(ytShort));
assert(normYt.includes('youtube.com/watch?v=dQw4w9WgXcQ'), 'youtu.be link should normalize to youtube.com/watch?v=...');
assert(!normYt.includes('si=') && !normYt.includes('utm_source'), 'YouTube tracking parameters must be stripped');

const ttShort = 'https://vm.tiktok.com/ZM812345/?utm_campaign=share';
const normTt = normalizeShortenedUrl(stripTrackingParams(ttShort));
assert(normTt.includes('tiktok.com'), 'vm.tiktok.com link should normalize to tiktok.com');

// Test 4: Invalid URL format
console.log('\n4. Testing Invalid URL Handling:');
const invalidUrl = 'not-a-valid-url';
const v4 = validateMediaUrl(invalidUrl);
assert(v4.isValid === false, 'Invalid string should not be a valid media URL');

// Test 5: Expired / 404 / Private URL
console.log('\n5. Testing Expired / 404 / Private URL Handling:');
const expiredUrl = 'https://www.instagram.com/p/private_expired_123/';
const v5 = validateMediaUrl(expiredUrl);
assert(v5.isValid === false, 'Expired or private URL should be flagged as invalid');
assert(v5.reason?.includes('expired') || v5.reason?.includes('private') || false, 'Reason should indicate expiry or privacy');

// Test 6: Missing URL in message
console.log('\n6. Testing Message Without URL:');
const dummyUser = { id: 12345, first_name: 'TestUser' };
const respNoUrl = handleUniversalDownloader(12345, dummyUser, 'سلام ربات عزیز بدون لینک');
assert(respNoUrl.length > 0, 'Should return prompt for URL');
assert(respNoUrl[0].text.includes('لطفاً لینک خودتون رو ارسال کنید'), 'Prompt should ask for URL');

// Test 7: Multiple URLs in message with tracking params
console.log('\n7. Testing Message With Multiple URLs & Tracking Params:');
const multiMsg = 'ببین این دوتا ویدیو چقدر خوبند https://www.youtube.com/watch?v=dQw4w9WgXcQ?utm_source=tg و همچنین https://www.instagram.com/reel/DeeiCBGgKjr/?igsh=abc123xyz';
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
