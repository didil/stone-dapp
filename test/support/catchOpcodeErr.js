module.exports = function catchOpcodeErr(err) {
  if (err.toString().indexOf("invalid opcode") < 0) {
    assert(false, err.toString());
  }
};