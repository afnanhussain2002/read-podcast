

type Props = {
  params: {
    userId: string;
  };
};

export default function UserDashboard({ params }: Props) {
  const { userId } = params;

  return (
    <div>
      <h1>Dashboard for User: {userId}</h1>
      {/* Fetch and show user-specific data here */}
    </div>
  );
}
