#!/usr/bin/env node

/**
 * Test script for security modules
 * Tests encryption, password hashing, and session management
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { encrypt, decrypt } from './src/lib/security/encryption';
import { hashPassword, verifyPassword } from './src/lib/security/password';
import {
  createSession,
  getSession,
  destroySession,
  cleanExpiredSessions,
} from './src/lib/security/session';

async function runTests() {
  console.log('🧪 Testing Security Modules\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Encryption round-trip
  console.log('Test 1: Encryption round-trip');
  try {
    const plaintext = 'sensitive health data';
    const encrypted = encrypt(plaintext);
    const decrypted = decrypt(encrypted);

    if (decrypted === plaintext) {
      console.log('✅ PASS: Encryption/decryption works correctly');
      console.log(`   Original: "${plaintext}"`);
      console.log(`   Encrypted IV: ${encrypted.iv.substring(0, 16)}...`);
      console.log(`   Decrypted: "${decrypted}"`);
      passed++;
    } else {
      console.log('❌ FAIL: Decrypted text does not match original');
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAIL: ${error}`);
    failed++;
  }
  console.log('');

  // Test 2: Each encryption has unique IV
  console.log('Test 2: Unique IVs for each encryption');
  try {
    const plaintext = 'test data';
    const enc1 = encrypt(plaintext);
    const enc2 = encrypt(plaintext);

    if (enc1.iv !== enc2.iv) {
      console.log('✅ PASS: Each encryption uses a unique IV');
      console.log(`   IV 1: ${enc1.iv.substring(0, 16)}...`);
      console.log(`   IV 2: ${enc2.iv.substring(0, 16)}...`);
      passed++;
    } else {
      console.log('❌ FAIL: IVs are not unique');
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAIL: ${error}`);
    failed++;
  }
  console.log('');

  // Test 3: Tampered data fails to decrypt
  console.log('Test 3: Tampered data detection');
  try {
    const plaintext = 'original data';
    const encrypted = encrypt(plaintext);

    // Tamper with the ciphertext
    const tampered = {
      ...encrypted,
      encrypted: encrypted.encrypted.replace(/a/g, 'b'),
    };

    try {
      decrypt(tampered);
      console.log('❌ FAIL: Tampered data was not detected');
      failed++;
    } catch (error) {
      console.log('✅ PASS: Tampered data correctly rejected');
      console.log(`   Error: ${(error as Error).message}`);
      passed++;
    }
  } catch (error) {
    console.log(`❌ FAIL: ${error}`);
    failed++;
  }
  console.log('');

  // Test 4: Password hashing and verification
  console.log('Test 4: Password hashing and verification');
  try {
    const password = 'password123';
    const hash = await hashPassword(password);

    const isValid = await verifyPassword(password, hash);
    const isInvalid = await verifyPassword('wrongpassword', hash);

    if (isValid && !isInvalid) {
      console.log('✅ PASS: Password hashing works correctly');
      console.log(`   Password: "${password}"`);
      console.log(`   Hash: ${hash.substring(0, 30)}...`);
      console.log(`   Correct password verified: ${isValid}`);
      console.log(`   Wrong password rejected: ${!isInvalid}`);
      passed++;
    } else {
      console.log('❌ FAIL: Password verification incorrect');
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAIL: ${error}`);
    failed++;
  }
  console.log('');

  // Test 5: Session creation and retrieval
  console.log('Test 5: Session creation and retrieval');
  try {
    const session = createSession();
    const retrieved = getSession(session.id);

    if (retrieved && retrieved.id === session.id) {
      console.log('✅ PASS: Session creation and retrieval works');
      console.log(`   Session ID: ${session.id.substring(0, 16)}...`);
      console.log(`   Created at: ${session.createdAt.toISOString()}`);
      console.log(`   Expires at: ${session.expiresAt.toISOString()}`);
      console.log(`   Retrieved successfully: ${retrieved !== null}`);
      passed++;
    } else {
      console.log('❌ FAIL: Session retrieval failed');
      failed++;
    }

    // Clean up
    destroySession(session.id);
  } catch (error) {
    console.log(`❌ FAIL: ${error}`);
    failed++;
  }
  console.log('');

  // Test 6: Session destruction
  console.log('Test 6: Session destruction');
  try {
    const session = createSession();
    destroySession(session.id);
    const retrieved = getSession(session.id);

    if (retrieved === null) {
      console.log('✅ PASS: Session destroyed successfully');
      console.log(`   Session ID: ${session.id.substring(0, 16)}...`);
      console.log(`   After destroy: ${retrieved}`);
      passed++;
    } else {
      console.log('❌ FAIL: Session still exists after destroy');
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAIL: ${error}`);
    failed++;
  }
  console.log('');

  // Test 7: Expired session cleanup
  console.log('Test 7: Expired session cleanup');
  try {
    // Create a session with 0 timeout (immediately expired)
    const session = createSession({ timeoutMinutes: 0 });

    // Wait a moment to ensure expiration
    await new Promise((resolve) => setTimeout(resolve, 100));

    const retrieved = getSession(session.id);

    if (retrieved === null) {
      console.log('✅ PASS: Expired session automatically destroyed');
      console.log(`   Session ID: ${session.id.substring(0, 16)}...`);
      console.log(`   Timeout: 0 minutes (immediate expiration)`);
      console.log(`   Retrieved after expiry: ${retrieved}`);
      passed++;
    } else {
      console.log('❌ FAIL: Expired session was not cleaned up');
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAIL: ${error}`);
    failed++;
  }
  console.log('');

  // Test 8: Clean expired sessions function
  console.log('Test 8: Clean expired sessions function');
  try {
    // Create some sessions with immediate expiration
    createSession({ timeoutMinutes: 0 });
    createSession({ timeoutMinutes: 0 });
    createSession({ timeoutMinutes: 0 });

    // Wait for expiration
    await new Promise((resolve) => setTimeout(resolve, 100));

    const cleaned = cleanExpiredSessions();

    if (cleaned >= 3) {
      console.log('✅ PASS: Expired sessions cleaned up');
      console.log(`   Sessions cleaned: ${cleaned}`);
      passed++;
    } else {
      console.log(`❌ FAIL: Only ${cleaned} sessions cleaned (expected >= 3)`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAIL: ${error}`);
    failed++;
  }
  console.log('');

  // Summary
  console.log('═'.repeat(50));
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed');
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
