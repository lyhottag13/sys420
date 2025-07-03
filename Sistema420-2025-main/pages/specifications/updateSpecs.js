import Header from "../../components/header";
import Footer from "../../components/footer";
import UpdateTestSpecifications from "../../components/specifications/updateTestSpecifications";
import { useSpecificationsStore } from "../../store/specificationsContext";
import { useUserStore } from "../../store/userContext";
import NotFound from "../../components/notFound"
import Loader from "../../components/loader";

import { parametersSections } from "../../constants/";
import PrintSpecificationsSheet from "../../components/print/specifications/printSpecificationsSheet"

import { useState, useEffect } from 'react';
import { useRouter } from "next/router";

export default function UpdateSpecs(){
    const { specifications, updateSpecifications } = useSpecificationsStore();
    const { user } = useUserStore();

    if(!specifications.pn || !(user.user_type == "ADMIN" || user.user_type == "admin")) return <NotFound />

    const router = useRouter();
    const [ actualSpecifications, setActualSpecifications] = useState(specifications);
    const [ isUpdating, setIsUpdating ] = useState(false);  

    
    const updateActualSpecifications = (id, newValue) => {
        let newSpecifications = {...actualSpecifications};
        newSpecifications[id] = newValue === ''? null : newValue;

        setActualSpecifications(newSpecifications);
    };
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        setIsUpdating(true);
        await updateSpecifications(actualSpecifications);
        setIsUpdating(false);
    }

    useEffect(()=>{
        if(specifications.revision === actualSpecifications.revision) return;

        router.push("/specifications/viewSpecs");
    }, [specifications])

    return(
        <div className="flex flex-col items-center justify-between min-h-screen overflow-hidden">
            <Header />

            <section className="w-full flex items-center justify-center border-b border-t border-gray-400 my-2 py-3 px-4">
                <div className="w-full grid grid-cols-1 md:flex md:flex-row md:items-end max-w-7xl justify-between text-xl">
                    <div className="flex flex-col">
                        <p>COTO System 420</p>
                        <div className="flex flex-row gap-x-2">
                            <p className="font-bold">PN:</p>
                            <p>{actualSpecifications.pn}</p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-x-2">
                            <p className="font-bold">APPL:</p>
                            <p>{actualSpecifications.application}</p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-x-2">
                            <p className="font-bold">REV. #:</p>
                            <p>{actualSpecifications.revision}</p>
                        </div>
                        <div className="flex flex-row gap-x-2">
                            <p className="font-bold">REV. DATE:</p>
                            <p>{actualSpecifications.revision_date}</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <main className="flex flex-col gap-y-6 w-full max-w-lg gap-x-5 mx-4 mb-12 relative">
                
                <div className="flex flex-col w-full mt-7 px-2">
                    {
                        parametersSections.map((section, index)=>(
                            <UpdateTestSpecifications updateActualSpecifications={updateActualSpecifications} key={`${section.name}-section`} name={section.name} sectionKey={section.key} parametersLabels={section.parameters} actualSpecifications={actualSpecifications}/>
                        ))
                    }
                </div>

                <button onClick={onSubmitHandler} className="border border-black rounded-lg py-2 px-5 bg-blue-500 text-white font-bold mx-auto hover:bg-blue-400">Update</button>
            
            </main>

            <Footer />

            {
                isUpdating &&
                <Loader />
            }
        </div>
    );
}