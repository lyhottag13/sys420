/**
 * Renders a boolean switch component that toggles between two states based on the provided value.
 * Clicking on the switch will update the actual specifications by toggling the current value.
 * 
 * @param {Object} props The properties passed to the BooleanSwitch component.
 * @param {string} props.id The unique identifier for the switch, used when updating specifications.
 * @param {boolean} props.value The current value of the switch, determining its state (true or false).
 * @param {Function} props.updateActualSpecifications The function to call when the switch is clicked, to update the specifications.
 * @param {boolean} [props.variant=false] Determines the text displayed on the switch. If true, displays "Yes"/"No"; if false, displays "On"/"Off".
 * @returns {JSX.Element} The JSX code for rendering the boolean switch component.
 */
export default function BooleanSwitch({ id, value, updateActualSpecifications, variant }){

    return (
            <div onClick={()=>{updateActualSpecifications(id, !value? 1 : 0)}} className="grid grid-cols-2 h-4 hover:cursor-pointer select-none">
                <div className={`border w-16 flex items-center border border-gray-500 justify-center rounded-l-lg ${value? "bg-gray-300" : "bg-red-500"}`}>
                    {
                        !value &&
                        <span className="text-sm font-bold text-white">{variant? "No" : "Off"}</span>
                    }
                </div>
                <div className={`border w-16 flex items-center border border-gray-500 border-l-0 justify-center rounded-r-lg ${value? "bg-green-500" : "bg-gray-300"}`}>
                    {
                        !!value &&
                        <span className="text-sm font-bold text-white">{variant? "Yes" : "On"}</span>
                    }
                </div>
            </div>
        );
}
