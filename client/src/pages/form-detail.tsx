
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchFormFields } from "@/lib/api";

export default function FormDetail() {
  const { formId } = useParams();
  
  const { data: formData, isLoading } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => fetchFormFields(formId),
    enabled: !!formId
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Form Detail</h1>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
}
