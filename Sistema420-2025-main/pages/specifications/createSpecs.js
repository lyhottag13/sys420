import Header from "../../components/header";
import Footer from "../../components/footer";
import CreateTestSpecifications from "../../components/specifications/createTestSpecifications";
import { useSpecificationsStore } from "../../store/specificationsContext";
import { useUserStore } from "../../store/userContext";
import NotFound from "../../components/notFound";
import Loader from "../../components/loader";

import { parametersSections } from "../../constants";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function UpdateSpecs() {
    const { specifications, createSpecifications, getSpecificationByPN } = useSpecificationsStore();
    const { user } = useUserStore();
    const router = useRouter();
    
    const [mode, setMode] = useState("new"); // "new" or "copy"
    const [partNumber, setPartNumber] = useState("");
    const [application, setApplication] = useState("FINAL"); // Campo application con valor predeterminado
    const [isLoading, setIsLoading] = useState(false);
    
    const [actualSpecifications, setActualSpecifications] = useState({
        pn: null,
        application: null,
        revision: null,
        revision_datetime: null,
        fixture: null,
        air_fixture: null,
        nominal_voltage: null,
        sort_file: null,
        graph_voltage: null,
        tube_qty_limit: null,
        is_shield_installed: 0,
        is_diode_installed: 0,
        contact_1_type: null,
        contact_2_type: null,
        contact_3_type: null,
        contact_4_type: null,
        atm: 0,
        atm_max_time: null,
        buz: 0,
        buz_cycles: null,
        buz_frequency: null,
        crs: 0,
        crs_nom_resistance: null,
        crs_tolerance: null,
        dio: 0,
        dcp: 0,
        dcp_max_peak_to_peak: null,
        dcr: 0,
        dcr_max_peak: null,
        dcr_start_measurment_window: null,
        dcr_window_width: null,
        dcr_sweeps: null,
        fbo: 0,
        fbo_percent_overdrive: null,
        fbo_delay: null,
        irs: 0,
        irs_range: null,
        irs_test_voltage: null,
        irs_delay: null,
        kel: 0,
        ocu: 0,
        ocu_max_current: null,
        ocu_min_current: null,
        otm: 0,
        otm_max_time: null,
        vtd: 0,
        vtd_min_differential: null,
        vtd_max_differential: null,
        vtr: 0,
        vtr_max_percentage: null,
        vtr_min_percentage: null,
        ovt: 0,
        ovt_max_voltage: null,
        ovt_min_voltage: null,
        ovt_delay: null,
    });

    const updateActualSpecifications = (id, newValue) => {
        setActualSpecifications(prev => ({
            ...prev,
            [id]: newValue === "" ? null : newValue,
        }));
    };

    const handleModeChange = (e) => {
        setMode(e.target.value);
    };

    const handlePartNumberChange = async (e) => {
        setPartNumber(e.target.value);
    };

    const loadSpecification = async () => {
        setIsLoading(true);
        try {
            const url = `/api/specifications?pn=${partNumber}&application=${application}`;
            console.log("Request URL:", url);

            const spec = await getSpecificationByPN(partNumber, application);
            if (spec && Object.keys(spec).length > 0) {
                console.log("Specification fetched:", spec);
                setActualSpecifications(spec);
            } else {
                alert("No specifications found for the given part number and application.");
            }
        } catch (error) {
            console.error("Error loading specification:", error);
            alert("An error occurred while loading the specification. Please try again.");
        }
        setIsLoading(false);
    };
    
    
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await createSpecifications(actualSpecifications);
        setIsLoading(false);
        router.push("/specifications/viewSpecs");
    };

    return (
        <div className="flex flex-col items-center justify-between min-h-screen overflow-hidden">
            <Header />
            <main className="flex flex-col gap-y-5 w-full max-w-lg mx-4 mb-12 relative">
                <h1 className="text-2xl font-bold mt-7 text-center">New Specifications Sheet</h1>
                
                <div className="mb-5">
                    <label className="block font-bold">Select Mode:</label>
                    <select value={mode} onChange={handleModeChange} className="border p-2 w-full rounded">
                        <option value="new">Create from scratch</option>
                        <option value="copy">Preload from an existing part number</option>
                    </select>
                </div>
                
                {mode === "copy" && (
                    <div className="mb-5">
                        <label className="block font-bold">Enter Part Number to Copy:</label>
                        <input type="text" value={partNumber} onChange={handlePartNumberChange} className="border p-2 w-full rounded"/>
                        <button type="button" onClick={loadSpecification} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Load Data</button>
                    </div>
                )}
                
                {mode === "copy" && (
                    <div className="mb-5">
                        <label className="block font-bold">Application:</label>
                        <input 
                            type="text" 
                            value={application} 
                            onChange={(e) => setApplication(e.target.value)} 
                            className="border p-2 w-full rounded"
                            disabled={mode !== "copy"} // Solo habilitar si es en modo "copy"
                        />
                    </div>
                )}
                
                {isLoading && <Loader />}
                
                <form onSubmit={onSubmitHandler} className="flex flex-col w-full px-2">
                    {parametersSections.map((section) => (
                        <CreateTestSpecifications 
                            key={section.name}
                            name={section.name} 
                            sectionKey={section.key} 
                            parametersLabels={section.parameters} 
                            actualSpecifications={actualSpecifications} 
                            updateActualSpecifications={updateActualSpecifications}
                        />
                    ))}
                    <button type="submit" className="mt-7 bg-blue-500 text-white font-bold py-2 px-5 rounded">Create</button>
                </form>
            </main>
            <Footer />
        </div>
    );
}
