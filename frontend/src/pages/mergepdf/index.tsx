
import React from 'react'
import MergePdf from '@/features/MergePdf'
import MainLayout from '@/layouts/MainLayout'

function Merge() {
  return (
    <>
    <MainLayout>
    <MergePdf/>
    </MainLayout>
    </>
  )
}

export default Merge

// import PDFUpload from '@/components/FileUploder'
// import { FooterCard } from '@/components/FooterCard'
// import React from 'react'

// function MergePDF() {
//   return (
//     <div className='px-16 pt-14 border h-full  flex flex-col space-y-6'>
//     <PDFUpload  heading={"Merge PDF"}  subheading={"Convert each PDF page into a JPG or extract all images contained in a PDF."}/>
//     <FooterCard/>
    


//     </div>
//   )
// }

// export default MergePDF
