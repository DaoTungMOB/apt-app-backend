const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
const OBJECT_ID_RULE_MESSAGE = 'Chuỗi không khớp với định dạng ObjectId!'

const ONLY_UNICODE_RULE = /^[\p{L}\s]+$/u
const ONLY_UNICODE_MESSAGE = 'Dữ liệu đầu vào phải là chữ cái'

const ONLY_ALPHABET_RULE = /^[a-zA-Z]$/
const ONLY_ALPHABET_MESSAGE = 'Dữ liệu đầu vào phải là chữ cái'

const ONLY_NUMBER_RULE = /^[0-9]$/
const ONLY_NUMBER_MESSAGE = 'Dữ liệu đầu vào phải là số'

const PASSWORD_RULE = /^[a-zA-Z0-9][^\s<>;'"\\]{8,32}$/
const PASSWORD_RULE_MESSAGE = 'Mật khẩu dài 8 đến 32 kí tự và không được chứa khoảng trắng hoặc ký tự không được phép như <, >, ;, \', \\.'

module.exports = {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  ONLY_UNICODE_RULE,
  ONLY_UNICODE_MESSAGE,
  ONLY_ALPHABET_RULE,
  ONLY_ALPHABET_MESSAGE,
  ONLY_NUMBER_RULE,
  ONLY_NUMBER_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
}