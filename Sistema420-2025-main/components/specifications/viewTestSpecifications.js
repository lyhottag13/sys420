export default function ViewTestSpecifications({ name, parametersLabels, specifications }){
    return(
        <div className="flex flex-col mt-6">
            <h2 className="text-2xl font-bold">{parametersLabels.length === 0? `${name} - Test is On` : name}</h2>

            <div className="flex flex-col">
                {
                    parametersLabels.map(parameter => {
                        if(!(parameter.hide_if_missing && !specifications[parameter.key]) || specifications[parameter.key] === 0){
                            return (
                                <div key={`${parameter.key}-container`} className="flex flex-row gap-x-2 text-xl">
                                    <p className="">{parameter.name}: </p>
                                    <div className="flex-grow border-b-2 border-black border-dotted mb-1"/>
                                    <p className="">{parameter.is_boolean? (specifications[parameter.key]? 'YES' : 'NO') : specifications[parameter.key] }</p>
                                </div>
                            );
                        }
                    })
                }
            </div>
        </div>
    );
}