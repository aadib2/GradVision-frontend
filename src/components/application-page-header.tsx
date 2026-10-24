type ApplicationPageHeaderProps = {
  title: string;
  description: string;
};

export function ApplicationPageHeader({
  title,
  description,
}: ApplicationPageHeaderProps) {
  return (
    <header className="border-b border-[var(--blue)] px-8 pt-8 pb-6">
      <h1 className="text-4xl">{title}</h1>
      <p className="mt-2">{description}</p>
    </header>
  );
}
