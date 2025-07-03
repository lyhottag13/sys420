// { pn, application, revision, revision_datetime, fixture, air_fixture, nominal_voltage, sort_file, graph_voltage, tube_qty_limit, is_shield_installed, is_diode_installed, contact_1_type, contact_2_type, contact_3_type, contact_4_type, atm, atm_max_time, buz, buz_cycles, buz_frequency, crs, crs_nom_resistance, crs_tolerance, dio, dcp, dcp_max_peak_to_peak, dcr, dcr_max_peak, dcr_start_measurment_window, dcr_window_width, dcr_sweeps, fbo, fbo_percent_overdrive, fbo_delay, irs, irs_range, irs_test_voltage, irs_delay, kel, ocu, ocu_max_current, ocu_min_current, otm, otm_max_time, vtd, vtd_min_differential, vtd_max_differential, vtr, vtr_max_percentage, vtr_min_percentage, ovt, ovt_max_voltage, ovt_min_voltage, ovt_delay, rcu, rcu_max_current, rcu_min_current, rtm, rtm_max_time, rvt, rvt_max_voltage, rvt_min_voltage, rvt_delay, scr, scr_max_resistance, scr_min_resistance, scr_delay, scs, scs_max_delta, scs_coil_voltage, scs_cycles, scs_warm_up, scs_delay, sho, sho_threshold_resistance, ttm,  ttm_min_time, bvs, bvs_test_voltage, bvs_hi_lim, bvs_lo_lim, bvs_ramp_up, bvs_dwell_time, bvs_ramp_down, bvs_charge_lo }

/**
 * Defines the sections and parameters for a configuration or specification form.
 * 
 * Each section contains a unique set of parameters used for different aspects of a product's specification, 
 * such as general information, actuate time, coil resistance, and more. This structure is designed to 
 * dynamically generate forms or documentation based on the defined sections and parameters.
 * 
 * @type {Array.<{
*   name: string, // The display name of the section.
*   key: string, // A unique key identifier for the section.
*   parameters: Array.<{
*     key: string, // A unique key identifier for the parameter.
*     name: string, // The display name of the parameter.
*     is_text?: boolean, // Optional. Indicates if the parameter value is text-based.
*     required?: boolean, // Optional. Indicates if the parameter is required.
*     hide_if_missing?: boolean, // Optional. Indicates if the parameter should be hidden if not provided.
*     is_boolean?: boolean, // Optional. Indicates if the parameter value is a boolean.
*   }>
* }>} parametersSections - An array of section objects, each containing a set of parameters for the section.
*/

const parametersSections = [
    {
        name: "General Information",
        key: "pn",
        parameters: [
            {
                key: "pn",
                name: "Part number",
                is_text: true,
                required: true
            },
            {
                key: "application",
                name: "Application",
                is_text: true,
                required: true
            },
            {
                key: "fixture",
                name: "Fixture#",
                is_text: true
            },
            {
                key: "air_fixture",
                name: "Air fixture number",
                is_text: true
            },
            {
                key: "nominal_voltage",
                name: "Nominal coil voltage",
                required: true
            },
            {
                key: "sort_file",
                name: "Sort file",
                hide_if_missing: true,
                is_text: true
            },
            {
                key: "graph_voltage",
                name: 'Voltage to digitize',
                hide_if_missing: true
            },
            {
                key: "tube_qty_limit",
                name: 'Tube Qty/Sort Limits'
            },
            {
                key: "is_shield_installed",
                name: 'Coaxial Shield Installed?',
                is_boolean: true
            },
            {
                key: "is_diode_installed",
                name: 'Is a diode installed?',
                is_boolean: true
            },
            {
                key: "contact_1_type",
                name: 'Contact #1 Type',
                is_text: true,
                required: true
            },
            {
                key: "contact_2_type",
                name: 'Contact #2 Type',
                hide_if_missing: true,
                is_text: true
            },
            {
                key: "contact_3_type",
                name: 'Contact #3 Type',
                hide_if_missing: true,
                is_text: true
            },
            {
                key: "contact_4_type",
                name: 'Contact #4 Type',
                hide_if_missing: true,
                is_text: true
            }
        ]
    },
    {
        name: 'Actuate Time',
        key: "atm",
        parameters: [
            {
                key: "atm_max_time",
                name: "Maximum actuate time (msecs)",
            }
        ]
    },
    {
        name: "Buzz",
        key: "buz",
        parameters: [
            {
                key: "buz_cycles",
                name: "Number of cycles",
            },
            {
                key: "buz_frequency",
                name: "Frequency (cps)",
            }
        ]
    },
    {
        name: "Coil Resistance",
        key: "crs",
        parameters: [
            {
                key: "crs_nom_resistance",
                name: "Nominal coil resistance (ohms)",
            },
            {
                key: "crs_tolerance",
                name: "Tolerance (%)",
            }
        ]
    },
    {
        name: "Diode",
        key: "dio",
        parameters: []
    },
    {
        name: "Dynamic Contact Resistance",
        key: "dcr",
        parameters: [
            {
                key: "dcr_max_peak",
                name: "Maximum peak DCR",
            },
            {
                key: "dcr_start_measurment_window",
                name: "Start of measurement window",
            },
            {
                key: "dcr_window_width",
                name: "Window width",
            },
            {
                key: "dcr_sweeps",
                name: "Number of Sweeps",
            }
        ]
    },
    {
        name: "DCR Peak to Peak",
        key: "dcp",
        parameters: [
            {
                key: "dcp_max_peak_to_peak",
                name: "Max peak to peak",
            },
        ]
    },
    {
        name: "Form-B Overdrive",
        key: "fbo",
        parameters: [
            {
                key: "fbo_percent_overdrive",
                name: "Percentage of overdrive",
            },
            {
                key: "fbo_delay",
                name: "Delay (msecs)",
            }
        ]
    },
    {
        name: "Insulation Resistance",
        key: "irs",
        parameters: [
            {
                key: "irs_range",
                name: "Range",
            },
            {
                key: "irs_test_voltage",
                name: "Test voltage",
            },
            {
                key: "irs_delay",
                name: "Wait delay (seconds)",
            }
        ]
    },
    {
        name: "Kelvin",
        key: "kel",
        parameters: []
    },
    {
        name: "Operate Current",
        key: "ocu",
        parameters: [
            {
                key: "ocu_max_current",
                name: "Max. operate current (mapms)",
            },
            {
                key: "ocu_min_current",
                name: "Min. operate current (mapms)",
            }
        ]
    },
    {
        name: "Operate Time",
        key: "otm",
        parameters: [
            {
                key: "otm_max_time",
                name: "Maximum operate time (msecs)",
            }
        ]
    },
    {
        name: "Voltage Differential",
        key: "vtd",
        parameters: [
            {
                key: "vtd_min_differential",
                name: "Maximum differential (V)",
            },
            {
                key: "vtd_max_differential",
                name: "Minimum differential (V)",
            }
        ]
    },
    {
        name: "Voltage Ratio",
        key: "vtr",
        parameters: [
            {
                key: "vtr_max_percentage",
                name: "Max. operate/release percent",
            },
            {
                key: "vtr_min_percentage",
                name: "Min. operate/release percent",
            }
        ]
    },
    {
        name: "Operate Voltage",
        key: "ovt",
        parameters: [
            {
                key: "ovt_max_voltage",
                name: "Maximum operate voltage",
            },
            {
                key: "ovt_min_voltage",
                name: "Minimum operate voltage",
            },
            {
                key: "ovt_delay",
                name: "Operate delay (msecs)",
            }
        ]
    },
    {
        name: "Release Current",
        key: "rcu",
        parameters: [
            {
                key: "rcu_max_current",
                name: "Max. release current (mamps)",
            },
            {
                key: "rcu_min_current",
                name: "Min. release current (mamps)",
            }
        ]
    },
    {
        name: "Release Time",
        key: "rtm",
        parameters: [
            {
                key: "rtm_max_time",
                name: "Maximum release time (msecs)",
            }
        ]
    },
    {
        name: "Release Voltage",
        key: "rvt",
        parameters: [
            {
                key: "rvt_max_voltage",
                name: "Maximum release voltage",
            },
            {
                key: "rvt_min_voltage",
                name: "Minimum release voltage",
            },
            {
                key: "rvt_delay",
                name: "Release delay (msecs)",
            }
        ]
    },
    {
        name: "Static Contact Resistance",
        key: "scr",
        parameters: [
            {
                key: "scr_max_resistance",
                name: "Max. contact resistance (ohms)",
            },
            {
                key: "scr_min_resistance",
                name: "Min. contact resistance (ohms)",
            },
            {
                key: "scr_delay",
                name: "Measurement delay (msecs)",
            }
        ]
    },
    {
        name: "CR Stability",
        key: "scs",
        parameters: [
            {
                key: "scs_max_delta",
                name: "Maximum delta CR",
            },
            {
                key: "scs_coil_voltage",
                name: "Coil voltage (voltage)",
            },
            {
                key: "scs_cycles",
                name: "Number of cycles",
            },
            {
                key: "scs_warm_up",
                name: "Number of warm-up cycles",
            },
            {
                key: "scs_delay",
                name: "Measurement delay (msecs)",
            }
        ]
    },
    {
        name: "Shorts",
        key: "sho",
        parameters: [
            {
                key: "sho_threshold_resistance",
                name: "Resistance Threshold (ohms)",
            }
        ]
    },
    {
        name: "Transfer Time",
        key: "ttm",
        parameters: [
            {
                key: "ttm_min_time",
                name: "Min. common open time (usecs)",
            }
        ]
    },
    {
        name: "Breakdown Voltage",
        key: "bvs",
        parameters: [
            {
                key: "bvs_test_voltage",
                name: "Test voltage",
            },
            {
                key: "bvs_hi_lim",
                name: "Hi Lim",
            },
            {
                key: "bvs_lo_lim",
                name: "Lo Lim",
            },
            {
                key: "bvs_ramp_up",
                name: "Ramp up",
            },
            {
                key: "bvs_dwell_time",
                name: "Dweel time",
            },
            {
                key: "bvs_ramp_down",
                name: "Ramp down",
            },
            {
                key: "bvs_charge_lo",
                name: "Charge Lo",
            }
        ]
    },
];

export default parametersSections; 