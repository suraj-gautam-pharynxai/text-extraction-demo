import { DocumentGrid } from "@/components/Document-grid";
import { MergeSection } from "@/components/MergeSection";

export default function PreviewSection({items}) {
  return (
    <div className="container grid h-screen gap-8 py-8 md:grid-cols-2">

      <div className="h-full overflow-auto">
        <DocumentGrid  items = {items}/>
      </div>
      <div className="h-full">
        <MergeSection item ={items}>
          <div className="flex h-full items-center justify-center text-center text-muted-foreground">
            <p>
              To Change the order of your PDF&apos;s
              <br />
              drag and drop the files as you want.
            </p>
          </div>
        </MergeSection>
      </div>
    </div>
  )
}

