import React from 'react';

// To be completed, basically a new component to replace the <i> tags to make
// things more readable and to further modularize our code base

const ButtonIcon = ({ classAndIconName, onClick, title }) => (
  <div>
    <i className={`fas fa-${classAndIconName}`} onClick={onClick} title={title} />
  </div>
);

export default ButtonIcon;
