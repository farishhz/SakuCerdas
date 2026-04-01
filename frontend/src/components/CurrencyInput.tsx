import React, { useState, useEffect } from 'react';

type CurrencyInputProps = {
  value: number | '';
  onChange: (val: number | '') => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

const formatRupiah = (val: string) => {
  const numberString = val.replace(/\D/g, '');
  if (!numberString) return '';
  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onChange, placeholder, className, disabled }) => {
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    if (value === '' || value === 0) {
      if (value === 0 && displayValue === '') return; // keep it if 0
      setDisplayValue(value === '' ? '' : '0');
    } else {
      setDisplayValue(formatRupiah(value.toString()));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    
    // Prevent starting with 0 unless it's just '0'
    if (raw.length > 1 && raw.startsWith('0')) {
      raw = raw.replace(/^0+/, '');
    }

    const formatted = formatRupiah(raw);
    setDisplayValue(formatted);

    const numericVal = parseInt(formatted.replace(/\./g, ''), 10);
    if (!isNaN(numericVal)) {
      onChange(numericVal);
    } else {
      onChange('');
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      className={className}
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      disabled={disabled}
    />
  );
};

export default CurrencyInput;
