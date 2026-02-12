import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';
import {
  AccessibleInput,
  AccessibleSelect,
  AccessibleRadioGroup,
  FormError,
} from '@/components/forms';

expect.extend(toHaveNoViolations);

describe('AccessibleInput', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(
      <AccessibleInput
        id="test-input"
        label="Test Label"
        value=""
        onChange={() => {}}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test('with error has no accessibility violations', async () => {
    const { container } = render(
      <AccessibleInput
        id="test-input"
        label="Test Label"
        value=""
        onChange={() => {}}
        error="This field is required"
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test('links error to input via aria-describedby', () => {
    const { container } = render(
      <AccessibleInput
        id="test-input"
        label="Test Label"
        value=""
        onChange={() => {}}
        error="This field is required"
      />
    );

    const input = container.querySelector('#test-input');
    const errorElement = container.querySelector('#test-input-error');

    expect(input).toHaveAttribute('aria-describedby');
    expect(input?.getAttribute('aria-describedby')).toContain('test-input-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent('This field is required');
  });

  test('with helpText links help via aria-describedby', () => {
    const { container } = render(
      <AccessibleInput
        id="test-input"
        label="Test Label"
        value=""
        onChange={() => {}}
        helpText="Enter your full name"
      />
    );

    const input = container.querySelector('#test-input');
    const helpElement = container.querySelector('#test-input-help');

    expect(input).toHaveAttribute('aria-describedby');
    expect(input?.getAttribute('aria-describedby')).toContain('test-input-help');
    expect(helpElement).toBeInTheDocument();
    expect(helpElement).toHaveTextContent('Enter your full name');
  });
});

describe('AccessibleSelect', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ];

  test('has no accessibility violations', async () => {
    const { container } = render(
      <AccessibleSelect
        id="test-select"
        label="Test Select"
        options={options}
        value=""
        onChange={() => {}}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test('with placeholder has no accessibility violations', async () => {
    const { container } = render(
      <AccessibleSelect
        id="test-select"
        label="Test Select"
        options={options}
        value=""
        onChange={() => {}}
        placeholder="Select an option"
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('AccessibleRadioGroup', () => {
  const options = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  test('has no accessibility violations', async () => {
    const { container } = render(
      <AccessibleRadioGroup
        name="test-radio"
        legend="Test Radio Group"
        options={options}
        value=""
        onChange={() => {}}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test('uses fieldset/legend pattern', () => {
    const { container } = render(
      <AccessibleRadioGroup
        name="test-radio"
        legend="Test Radio Group"
        options={options}
        value=""
        onChange={() => {}}
      />
    );

    const fieldset = container.querySelector('fieldset');
    const legend = container.querySelector('legend');

    expect(fieldset).toBeInTheDocument();
    expect(legend).toBeInTheDocument();
    expect(legend).toHaveTextContent('Test Radio Group');
  });

  test('with error has no accessibility violations', async () => {
    const { container } = render(
      <AccessibleRadioGroup
        name="test-radio"
        legend="Test Radio Group"
        options={options}
        value=""
        onChange={() => {}}
        error="Please select an option"
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('FormError', () => {
  test('has role=alert and aria-live', () => {
    const { container } = render(
      <FormError id="test-error" message="Error message" />
    );

    const errorElement = container.querySelector('#test-error');

    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveAttribute('role', 'alert');
    expect(errorElement).toHaveAttribute('aria-live', 'polite');
    expect(errorElement).toHaveTextContent('Error message');
  });

  test('renders nothing when no message', () => {
    const { container } = render(<FormError id="test-error" />);

    const errorElement = container.querySelector('#test-error');
    expect(errorElement).not.toBeInTheDocument();
  });
});
