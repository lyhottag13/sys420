import BooleanSwitch from "../booleanSwitch";


/**
 * dateTestSpecifications- This Function is a React component used to modify existing test specifications. 
 * It creates a form where users can update parameters for a test.
 *
 * @param {string} name - The name of the test.
 * @param {Array<Object>} parametersLabels - An array of objects containing information about test parameters.
 * @param {Object} actualSpecifications - Object containing actual specifications.
 * @param {string} sectionKey - The key of the section.
 * @param {function} updateActualSpecifications - A function to update actual specifications.
 * @return {JSX.Element} The updated test specifications component.
 */

export default function UpdateTestSpecifications({ name, parametersLabels, actualSpecifications, sectionKey, updateActualSpecifications }){
    return(
        <div className="flex flex-col mt-6">
            <div className="flex flex-row items-center gap-x-6">
                <h2 className="text-2xl font-bold">{name}</h2>
                {
                    sectionKey != 'pn' &&
                    <BooleanSwitch id={sectionKey} updateActualSpecifications={updateActualSpecifications} value={actualSpecifications[sectionKey]}/>
                }
            </div>

            <div className="flex flex-col gap-y-3">
                {
                    parametersLabels.map(parameter => (
                        (parameter.key != "pn" && parameter.key != "application") &&
                        <div key={`${parameter.key}-container`} className={`flex ${parameter.is_boolean? "flex-row items-center" : "flex-col"} gap-x-5 text-xl`}>
                            <p className="">{parameter.name}: </p>
                            {
                                parameter.is_boolean?
                                <BooleanSwitch variant={true} id={parameter.key} updateActualSpecifications={updateActualSpecifications} value={actualSpecifications[parameter.key]}/>
                                :
                                <input onChange={(e)=>{updateActualSpecifications(parameter.key, e.target.value)}} className="border border-blue-900 rounded" type={parameter.is_text? "text" : "number"} defaultValue={actualSpecifications[parameter.key]} />
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    );
}