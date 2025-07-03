import { Result } from "postcss";

/**
 * Defines parameters and calculations for various tests.
 * 
 * This object maps test identifiers to their respective parameters, including names,
 * units of measurement, bin sizes for categorization, methods for calculating maximum and minimum
 * viewable and passable values, and the number of decimals to display for precision.
 * 
 * Each test parameter object can include functions that calculate values based on input parameters,
 * such as nominal resistance and tolerance for Coil Resistance (CRS), or nominal voltage for Operate
 * Voltage (OVT). These functions ensure dynamic calculation of limits based on specific test conditions.
 * 
 * }>} testsViewParameters - An object mapping test identifiers to their parameters.
*/
const testsViewParameters = {
  CRS: {
    name: "Coil Resistance",
    short_name: "Coil Resistance",
    units: "Ohms",
    bin_size: 1,
    failure_reason: Result,
    max_view: ({crs_nom_resistance, crs_tolerance})=>( Math.ceil(crs_nom_resistance * (1 + crs_tolerance / 100) / 50) * 50 + 50 ),
    min_view: ({crs_nom_resistance, crs_tolerance})=>( Math.ceil(crs_nom_resistance * (1 - crs_tolerance / 100) / 50) * 50 - 50 ),
    max_pass: ({crs_nom_resistance, crs_tolerance})=>(crs_nom_resistance * (1 + crs_tolerance / 100) ),
    min_pass: ({crs_nom_resistance, crs_tolerance})=>(crs_nom_resistance * (1 - crs_tolerance / 100) ),
    decimals: 3
  },
  DIO: {
    name: "Diode",
    short_name: "Diode",
    failure_reason: Result,
    decimals: 2
  },
  KEL: {
    name: "Kelvin",
    short_name: "Kelvin",
    failure_reason: Result,
    decimals: 2
  },
  SHO: {
    name: "Shorts",
    short_name: "Shorts",
    failure_reason: Result,
    decimals: 2
  },
  IRS: {
    name: "Insulation Resistance",
    short_name: "Insulation Resistance",
    failure_reason: Result,
    decimals: 0
  },
  OVT: {
    name: "Operate Voltage",
    short_name: "Operate Voltage",
    units: "Volts",
    bin_size: 0.1,
    failure_reason: Result,
    max_view: ({ nominal_voltage })=>( nominal_voltage ),
    min_view: ()=>(0),
    max_pass: ({ovt_max_voltage})=>(ovt_max_voltage),
    min_pass: ({ovt_min_voltage})=>(ovt_min_voltage),
    decimals: 2
  },
  RVT: {
    name: "Release Voltage",
    short_name: "Release Voltage",
    units: "Volts",
    bin_size: 0.1,
    failure_reason: Result,
    max_view: ({ nominal_voltage })=>( nominal_voltage ),
    min_view: ()=>(0),
    max_pass: ({rvt_max_voltage})=>(rvt_max_voltage),
    min_pass: ({rvt_min_voltage})=>(rvt_min_voltage),
    decimals: 2
  },
  OCU: {
    name: "Operate Current",
    short_name: "Operate Current",
    units: "Ampers",
    bin_size: 0.02,
    failure_reason: Result,
    max_view: ({ocu_max_current})=>( Math.ceil( ocu_max_current / 0.02) * 0.02 + 0.02 ),
    min_view: ()=>(0),
    max_pass: ({ocu_max_current})=>(ocu_max_current),
    min_pass: ({ocu_min_current})=>(ocu_min_current),
    decimals: 2
  },
  RCU: {
    name: "Release Current",
    short_name: "Release Current",
    units: "Ampers",
    bin_size: 0.02,
    failure_reason: Result,
    max_view: ({rcu_max_current})=>( Math.ceil( rcu_max_current / 0.02) * 0.02 + 0.02 ),
    min_view: ()=>(0),
    max_pass: ({rcu_max_current})=>(rcu_max_current),
    min_pass: ({rcu_min_current})=>(rcu_min_current),
    decimals: 2
  },
  VTD: {
    name: "Operate-Release Voltage Differential",
    short_name: "Operate-Release Voltage Differential",
    units: "Volts",
    bin_size: 0.5,
    failure_reason: Result,
    max_view: ({ nominal_voltage })=>( nominal_voltage ),
    min_view: ()=>(0),
    max_pass: ({vtd_max_differential})=>(vtd_max_differential),
    min_pass: ({vtd_min_differential})=>(vtd_min_differential),
    decimals: 2
  },
  VTR: {
    name: "Operate/Release Voltage Ratio",
    short_name: "Operate/Release Voltage Ratio",
    units: "%",
    bin_size: 0.5,
    failure_reason: Result,
    max_view: ({ nominal_voltage })=>( nominal_voltage ),
    min_view: ()=>(0),
    max_pass: ({vtr_max_percentage})=>(vtr_max_percentage),
    min_pass: ({vtr_min_percentage})=>(vtr_min_percentage),
    decimals: 2
  },
  ATM: {
    name: "Actuate Time",
    short_name: "Actuate Time",
    units: "μsec",
    bin_size: 0.01,
    failure_reason: Result,
    max_view: ({atm_max_time})=>( Math.ceil( (atm_max_time*1000) / 0.05) * 0.05 + 0.05  ),
    min_view: ()=>(0),
    max_pass: ({atm_max_time})=>(Math.ceil( atm_max_time*1000)),
    decimals: 0
  },
  OTM: {
    name: "Operate Time",
    short_name: "Operate Time",
    units: "μsec",
    bin_size: 0.01,
    failure_reason: Result,
    max_view: ({ otm_max_time })=>( Math.ceil( otm_max_time*1000 / 0.05) * 0.05 + 0.05  ),
    min_view: ()=>(0),
    max_pass: ({otm_max_time})=>(Math.ceil( otm_max_time*1000 )),
    decimals: 0
  },
  RTM: {
    name: "Release Time",
    short_name: "Release Time",
    units: "μsec",
    bin_size: 0.01,
    failure_reason: Result,
    max_view: ({ rtm_max_time })=>( Math.ceil( rtm_max_time / 0.05) * 0.05 + 0.05  ) * 1000,
    min_view: ()=>(0),
    max_pass: ({rtm_max_time})=>(rtm_max_time) *1000,
    decimals: 0
  },
  TTM: {
    name: "Transfer Time",
    short_name: "Transfer Time",
    failure_reason: Result,
    decimals: 0
  },
  SCR: {
    name: "Static Contact Resistance",
    short_name: "Static Contact Resistance",
    units: "Ohms",
    bin_size: 0.001,
    failure_reason: Result,
    max_view: ({scr_max_resistance})=>( Math.ceil( scr_max_resistance / 0.01) * 0.01 + 0.01 ),
    min_view: ()=>(0),
    max_pass: ({scr_max_resistance})=>(scr_max_resistance),
    min_pass: ({scr_min_resistance})=>(scr_min_resistance),
    decimals: 4
  },
  SCS: {
    name: "Contact Resistance Stability",
    short_name: "Contact Resistance Stability",
    units: "Ohms",
    bin_size: 0.001,
    failure_reason: Result,
    max_view: ({scs_max_delta})=>( Math.ceil( scs_max_delta / 0.03) * 0.03 + 0.03 ),
    min_view: ()=>(0),
    max_pass: ({scs_max_delta})=>(scs_max_delta),
    decimals: 4
  },
  DCR: {
    name: "Dynamic Contact Resistance",
    short_name: "Dynamic Contact Resistance",
    units: "Ohms",
    bin_size: 0.001,
    failure_reason: Result,
    max_view: ({dcr_max_peak})=>( Math.ceil( dcr_max_peak / 0.01) * 0.01 + 0.01  ),
    min_view: ()=>(0),
    max_pass: ({dcr_max_peak})=>(dcr_max_peak),
    decimals: 4
  },
  DCP: {
    name: "Dynamic CR Peak to Peak",
    short_name: "Dynamic CR Peak to Peak",
    units: "Ohms",
    bin_size: 0.002,
    failure_reason: Result,
    max_view: ({dcp_max_peak_to_peak})=>( Math.ceil( dcp_max_peak_to_peak / 0.01) * 0.01 + 0.01  ),
    min_view: ()=>(0),
    max_pass: ({dcp_max_peak_to_peak})=>(dcp_max_peak_to_peak),
    decimals: 4
  }
};

export default testsViewParameters;