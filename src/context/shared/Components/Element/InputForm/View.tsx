import React, { CSSProperties, ElementType } from 'react';
import { Col, Form, Input, InputGroup } from 'rsuite';
import './Style.scss';

interface Props {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  size?: 'sm' | 'lg' | undefined;
  name: string;
  type?: string;
  pattern?: string | undefined;
  upper?: boolean;
  disabled?: boolean;
  placeholder?: string;
  classForm?: string;
  classText?: string;
  text?: string;
  min?: number | string;
  max?: number | string;
  maxLength?: number;
  minLength?: number;
  childrenPrepend?: React.ReactNode;
  childrenPostpend?: React.ReactNode;
  value: any;
  //eslint-disable-next-line
  onChange: Function;
  //eslint-disable-next-line
  onBlur?: Function;
  error: string;
  innerRef?: any;
  accept?: string;
  as?: ElementType<any>;
  style?: CSSProperties;
  rows?: number;
  hidden?: boolean;
  classLabel?: string;
  addColClass?: boolean;
  readOnly?: boolean;
  //eslint-disable-next-line
  onKeyDown?: Function;
  //eslint-disable-next-line
  onSelect?: Function;
  //eslint-disable-next-line
  onFocus?: Function;
  required?: boolean;
}

export const InputForm = ({ xs, sm, md, lg, xl, xxl, size = 'sm', name, type = 'text', pattern, upper = true, disabled = false, placeholder, classForm = '', classText = '', text, min, max, maxLength, minLength, childrenPrepend, childrenPostpend, value, onChange, onBlur, error, innerRef, accept, as, style, rows, hidden, classLabel, readOnly, onKeyDown, onSelect, onFocus, required }: Props) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) {
      onKeyDown(event);
    } else if (event.key === 'Enter') {
      const form = event.currentTarget.closest('form');
      if (form) form.submit();
    }
  };
  return (
    <Form.Group hidden={hidden} className={`input-form ${classForm}`} as={Col as any} xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      {text && <Form.ControlLabel className={classLabel} dangerouslySetInnerHTML={{ __html: `${text}${required ? `<span style="color: red;"> (*) </span>` : ''}` }} />}
      <InputGroup style={{ marginTop: '3px' }} size={size} inside>
        {childrenPrepend}
        <Input
          // id={name}
          as={as as any}
          rows={rows}
          style={style}
          ref={innerRef}
          accept={accept}
          className={classText}
          name={name}
          type={type}
          pattern={pattern}
          placeholder={placeholder || text || '...'}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete="off"
          value={type === 'file' ? undefined : value}
          title={type === 'file' ? undefined : value}
          maxLength={maxLength}
          minLength={minLength}
          min={min}
          max={max}
          onChange={(params: string, e: React.ChangeEvent<HTMLInputElement>) => {
            let value: any = e.target.validity.valid ? (upper ? e.target.value.toUpperCase() : e.target.value) : null;
            value = e.target.files?.length ? e.target.files : value;
            onChange && onChange(name, value);
          }}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (upper) {
              const { selectionStart, selectionEnd } = e.target;
              e.target.value = e.target.value.toUpperCase();
              e.target.selectionStart = selectionStart;
              e.target.selectionEnd = selectionEnd;
            }
          }}
          onBlur={(event) => onBlur && onBlur(event)}
          onKeyDown={handleKeyDown}
          onSelect={(event) => onSelect && onSelect(event)}
          onFocus={(event) => onFocus && onFocus(event)}
        />
        {childrenPostpend}
      </InputGroup>
      <Form.ErrorMessage show={!!error} placement="bottomStart">
        {error}
      </Form.ErrorMessage>
    </Form.Group>
  );
};
