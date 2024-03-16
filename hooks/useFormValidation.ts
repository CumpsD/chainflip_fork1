import { useRef } from 'react';

type Validator = () => boolean;

export default function useFormValidation<K extends string>(validators: Record<K, Validator>) {
  const formValidation = useRef<Record<K, Validator>>(validators);

  return {
    setValidator(key: K, validator: Validator) {
      formValidation.current[key] = validator;
    },
    validateForm() {
      return Object.values<Validator>(formValidation.current).reduce(
        // make sure to call cb first so it doesn't short circuit
        (acc, cb) => cb() && acc,
        true,
      );
    },
  };
}
