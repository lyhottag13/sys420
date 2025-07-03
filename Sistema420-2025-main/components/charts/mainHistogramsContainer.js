import { useMemo } from 'react';

import { testsViewParameters } from '../../constants/index';
import SwitchHistogramContainer from './switchHistogramsContainer';


/**
 * Renders a container for multiple switch histograms based on selected test data.
 * Utilizes React's useMemo hook for efficient computation of switch data.
 * 
 * @param {boolean} printing - Indicates if the component is being rendered for printing purposes.
 * @param {boolean} hideFails - Indicates if failed test results should be hidden.
 * @param {Object} selectedTest - The selected test data containing test results and specifications.
 * @returns {JSX.Element} A React component representing the main histogram container.
 */
export default function MainHistogramContainer({printing, hideFails, selectedTest}){
    const switchesArray = useMemo(() => {
        let objectData = [];
    
        for (let { dut_no, switch: switchn, test_type, value, result } of selectedTest["test_result"]) {
          if (!value && value != 0) continue;
          if (!testsViewParameters[test_type].units) continue;
          if (!objectData[switchn]) objectData[switchn] = {};

          if (!objectData[switchn][test_type]) {
            let tempObject = {};

            tempObject["data"] = [];

            objectData[switchn][test_type] = tempObject;

          }
          objectData[switchn][test_type]["data"].push(value);
        }
        return objectData;
      }, [selectedTest]);
    

    return(
        <div className={printing? '' : 'flex flex-col w-full items-center'}>
            {switchesArray.map((switchObject, index) => (
                <SwitchHistogramContainer printing={printing} hideFails={hideFails} key={`Switch_${index}_container`} params={selectedTest.part_test_specifications} switchNumber={ index } switchObject={switchObject}/>
            ))
            }
        </div>
    );
}