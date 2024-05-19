import * as yup from 'yup';

const idNumberSchema = yup.number();
const nameSchema = yup.string().trim().min(2).max(50).required('Name is required');

const UserValidationSchema = yup.object().shape({
  id: idNumberSchema,
  name: nameSchema,
});

export default UserValidationSchema;