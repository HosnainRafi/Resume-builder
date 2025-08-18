// src/components/withAdvancedEditing.jsx

import React, { useCallback } from 'react';
import EnhancedEditableField from './EnhancedEditableField';

const withAdvancedEditing = (WrappedComponent) => {
  const EditableComponent = (props) => {
    const { resumeData, onFieldChange, isEditable, ...otherProps } = props;

    const AdvancedEditableField = useCallback(
      ({
        field,
        content,
        className = '',
        placeholder = 'Click to edit',
        tag = 'div',
        multiline = false,
        ...fieldProps
      }) => {
        if (!isEditable) {
          const Tag = tag;
          return (
            <Tag className={className} {...fieldProps}>
              {content}
            </Tag>
          );
        }

        return (
          <EnhancedEditableField
            field={field}
            content={content}
            className={className}
            placeholder={placeholder}
            tag={tag}
            onFieldChange={onFieldChange}
            multiline={multiline}
            {...fieldProps}
          />
        );
      },
      [isEditable, onFieldChange]
    );

    return (
      <div className="advanced-editable-wrapper">
        <WrappedComponent
          {...otherProps}
          resumeData={resumeData}
          EditableField={AdvancedEditableField}
          isEditable={isEditable}
        />
      </div>
    );
  };

  EditableComponent.displayName = `withAdvancedEditing(${WrappedComponent.displayName || WrappedComponent.name})`;

  return EditableComponent;
};

export default withAdvancedEditing;
