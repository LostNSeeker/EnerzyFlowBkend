function ADD(a, b) {
  return a + b;
}

test('Operations[ADD] => ADD(1, 2) == 3', () => {
  expect(ADD(1, 2)).toBe(3);
})
