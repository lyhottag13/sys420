import { testsViewParameters, switchesLabels } from '../../constants/index';
import TestHistogram from './testHistogram';


/**
 * Renders a container for switch histograms based on the provided switch data.
 * 
 * @param {Object} params - The parameters for the switch histograms.
 * @param {boolean} printing - Indicates if the component is being rendered for printing purposes.
 * @param {boolean} hideFails - Indicates if failed test results should be hidden.
 * @param {number} switchNumber - The number of the switch.
 * @param {Object} switchObject - The data object containing test results for the switch.
 * @returns {JSX.Element} A React component representing the switch histogram container.
 */

const orderedTestTypes = [
    "CRS", // COIL RESISTANCE
    "OVT", // OPERATE VOLTAGE
    "RVT", // RELEASE VOLTAGE
    "SCR", // STATIC CONTACT RESISTANCE
    "OTM", // OPERATE TIME
    "ATM", // ACTUATE TIME
    "RTM", // RELEASE TIME
    "DCR", // DYNAMIC CONTACT RESISTANCE
    "DCP", // DYNAMIC CR PEAK TO PEAK
    "SCS", // CONTACT RESISTANCE STABILITY
  ];

export default function SwitchHistogramContainer({ params, printing, hideFails, switchNumber, switchObject }){
    const sortedKeys = orderedTestTypes.filter(type => switchObject[type]);
    return(
        <div className={printing? "" : "flex flex-col items-center mt-6 w-full"} switch_name={switchesLabels[switchNumber]}>
            <h2 className='font-bold text-xl'>{switchesLabels[switchNumber]}</h2>

            <div className={printing? '' : 'flex flex-row flex-wrap justify-center w-full gap-y-6'}>
                {
                    sortedKeys.map((key) => (
                       <TestHistogram printing={printing} hideFails={hideFails} params={params} key={`${switchNumber}-${key}`} testType={key} testArray={switchObject[key].data.map((a) => (parseFloat(a)))} />
                   
                    ))
                }
            </div>
        </div>
    );
}