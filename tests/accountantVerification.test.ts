import test from 'node:test';
import assert from 'node:assert/strict';
import { resolvePaymentIdForTransaction } from '../src/utils/accountantVerification';

test('resolves the underlying payment id from a transaction id with TXN prefix', () => {
  const payments = [{ id: 'PAY-2026-1234', studentId: 'stu-1', studentName: 'Alem' } as any];
  assert.equal(resolvePaymentIdForTransaction('TXN-PAY-2026-1234', payments), 'PAY-2026-1234');
});

test('returns the transaction id unchanged when it already matches a payment id', () => {
  const payments = [{ id: 'PAY-2026-9999', studentId: 'stu-2', studentName: 'Beka' } as any];
  assert.equal(resolvePaymentIdForTransaction('PAY-2026-9999', payments), 'PAY-2026-9999');
});

test('falls back to a payment matched by reference when id does not match directly', () => {
  const payments = [{ id: 'PAY-2026-7777', studentId: 'stu-3', studentName: 'Coda', referenceNumber: 'REF-100' } as any];
  const transaction = { id: 'TXN-999', referenceNumber: 'REF-100', studentName: 'Coda' } as any;
  assert.equal(resolvePaymentIdForTransaction(transaction.id, payments, transaction), 'PAY-2026-7777');
});

test('can resolve a payment id from a legacy fallback payment list', () => {
  const transaction = { id: 'TXN-888', referenceNumber: 'REF-200', studentName: 'Dawit' } as any;
  const fallbackPayments = [{ id: 'PAY-2026-8888', studentId: 'stu-4', studentName: 'Dawit', referenceNumber: 'REF-200' } as any];
  assert.equal(resolvePaymentIdForTransaction(transaction.id, [], transaction, fallbackPayments), 'PAY-2026-8888');
});
