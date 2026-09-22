interface Props {
  stage: string;
}

export default function StageBadge({ stage }: Props) {
  return (
    <div className="stage-badge">
      <span>Current Journey</span>
      <strong>{stage}</strong>
    </div>
  );
}