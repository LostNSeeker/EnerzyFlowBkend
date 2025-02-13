function ADD(a, b) {
  return a + b;
}

test('Ops.ADD Testing sum(1, 2) for 3', () => {
  expect(ADD(1, 2)).toBe(3);
})
