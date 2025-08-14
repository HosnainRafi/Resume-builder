import React from 'react';
import { Card, ButtonGroup, Button } from 'react-bootstrap';

function TemplateSelector({ selected, onSelect }) {
  const templates = [
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
  ];

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Resume Template</Card.Header>
      <Card.Body>
        <ButtonGroup aria-label="Template selection">
          {templates.map((template) => (
            <Button
              key={template.id}
              variant={selected === template.id ? 'primary' : 'outline-primary'}
              onClick={() => onSelect(template.id)}
            >
              {template.name}
            </Button>
          ))}
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
}

export default TemplateSelector;
