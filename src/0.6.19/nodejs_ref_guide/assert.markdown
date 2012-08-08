## assert

> Stability: 5 - Locked

All of the `assert` methods basically compare two different states—an expected
one, and an actual one—and return a Boolean condition. If the comparisson is
`true`, the condition passes. If an assert method is `false`, the entire Node.js
app crashes.

Some methods have an additional `message` parameter, which sends text out to the
console when the assert fails.

