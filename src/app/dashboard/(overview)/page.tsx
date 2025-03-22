import { lusitana } from "@/app/ui/fonts";
import { Heading } from "@chakra-ui/react";

export default async function Page() {
  return (
    <main>
      <Heading
        as="h1"
        className={lusitana.className}
        mb={4}
        fontSize={{ base: "xl", md: "2xl" }}
      >
        Dashboard
      </Heading>
    </main>
  );
}
