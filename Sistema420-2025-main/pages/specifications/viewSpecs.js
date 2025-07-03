import Header from "../../components/header";
import Footer from "../../components/footer";
import ViewTestSpecifications from "../../components/specifications/viewTestSpecifications";
import { useSpecificationsStore } from "../../store/specificationsContext";
import NotFound from "../../components/notFound"

import { parametersSections } from "../../constants/";
import PrintSpecificationsSheet from "../../components/print/specifications/printSpecificationsSheet"

export default function ViewSpecs(){
    const { specifications } = useSpecificationsStore();
    if(!specifications.pn ) return <NotFound />

    return(
        <div className="flex flex-col items-center justify-between min-h-screen overflow-hidden">
            <Header />

            <section className="w-full flex items-center justify-center border-b border-t border-gray-400 my-2 py-3 px-4">
                <div className="w-full grid grid-cols-1 md:flex md:flex-row md:items-end max-w-7xl justify-between text-xl">
                    <div className="flex flex-col">
                        <p>COTO System 420</p>
                        <div className="flex flex-row gap-x-2">
                            <p className="font-bold">PN:</p>
                            <p>{specifications.pn}</p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-x-2">
                            <p className="font-bold">APPL:</p>
                            <p>{specifications.application}</p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-x-2">
                            <p className="font-bold">REV. #:</p>
                            <p>{specifications.revision}</p>
                        </div>
                        <div className="flex flex-row gap-x-2">
                            <p className="font-bold">REV. DATE:</p>
                            <p>{specifications.revision_date}</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <main className="flex flex-col w-full max-w-lg gap-x-5 mx-4 mb-12 relative">
                
                <div className="flex flex-col w-full mt-7 px-2">
                    {
                        parametersSections.map((section, index)=>{
                            if (specifications[section.key]){
                                
                                return <ViewTestSpecifications index={index} key={`${section.name}-section`} name={section.name} parametersLabels={section.parameters} specifications={specifications}/>;
                            }
                        })
                    }
                </div>
            </main>

            <Footer />

            <PrintSpecificationsSheet specifications={ specifications } />
        </div>
    );
}