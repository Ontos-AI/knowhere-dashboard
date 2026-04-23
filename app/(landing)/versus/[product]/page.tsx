type PageProps = {
  params: Promise<{
    product: string;
  }>;
};

// Static Site Generation - Pre-render pages at build time
export function generateStaticParams() {
  return [{ product: "unstructured" }, { product: "markitdown" }];
}

export default async function VersusPage({ params }: PageProps) {
  const { product } = await params;

  return <div></div>;
}
