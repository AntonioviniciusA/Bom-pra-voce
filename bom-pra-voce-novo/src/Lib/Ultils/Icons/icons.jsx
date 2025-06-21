import {} from "lucide-react";

export const iconComponents = {};

export const Icon = ({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  ...props
}) => {
  const IconComponent = iconComponents[name];

  if (!IconComponent) {
    console.warn(`Ícone "${name}" não encontrado`);
    return null;
  }

  return (
    <IconComponent size={size} color={color} className={className} {...props} />
  );
};

export const getIcon = (name, props = {}) => {
  return <Icon name={name} {...props} />;
};
