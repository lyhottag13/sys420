import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client for database operations
const prisma = new PrismaClient();

// { pn, application, revision, revision_datetime, fixture, air_fixture, nominal_voltage, sort_file, graph_voltage, tube_qty_limit, is_shield_installed, is_diode_installed, contact_1_type, contact_2_type, contact_3_type, contact_4_type, atm, atm_max_time, buz, buz_cycles, buz_frequency, crs, crs_nom_resistance, crs_tolerance, dio, dcp, dcp_max_peak_to_peak, dcr, dcr_max_peak, dcr_start_measurment_window, dcr_window_width, dcr_sweeps, fbo, fbo_percent_overdrive, fbo_delay, irs, irs_range, irs_test_voltage, irs_delay, kel, ocu, ocu_max_current, ocu_min_current, otm, otm_max_time, vtd, vtd_min_differential, vtd_max_differential, vtr, vtr_max_percentage, vtr_min_percentage, ovt, ovt_max_voltage, ovt_min_voltage, ovt_delay, rcu, rcu_max_current, rcu_min_current, rtm, rtm_max_time, rvt, rvt_max_voltage, rvt_min_voltage, rvt_delay, scr, scr_max_resistance, scr_min_resistance, scr_delay, scs, scs_max_delta, scs_coil_voltage, scs_cycles, scs_warm_up, scs_delay, sho, sho_threshold_resistance, ttm,  ttm_min_time, bvs, bvs_test_voltage, bvs_hi_lim, bvs_lo_lim, bvs_ramp_up, bvs_dwell_time, bvs_ramp_down, bvs_charge_lo }


/**
 * API for managing part test specifications.
 * Provides functionality to retrieve, create, and update test specifications for parts.
 *
 * GET / - Retrieves test specifications for a specific part number and application.
 * POST / - Creates new test specifications for a part.
 * PATCH / - Updates existing test specifications for a part.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export default async function handler(req, res) {

  /**
   * Handles GET requests.
   * Retrieves the test specifications for a specific part number and application.
   *
   * @param {Object} req - The request object containing query parameters:
   * @param {string} req.query.pn - Part number.
   * @param {string} req.query.application - Application identifier.
   * @param {Object} res - The response object used to send back HTTP responses.
   */ 
  if (req.method === 'GET') {
    try{
      const { pn, application } = req.query;
      if( !pn || !application ) return res.status(400).json({error: 'Required params were not given.'})

      const query = {
          where: {
            pn_application: {
              pn,
              application
            }
          }
      };

      let specifications = await prisma.part_test_specifications.findUnique(query);

      if(!specifications) return res.status(404).json({error: 'Specifications for this Part Number and Application were not found.'})

      res.status(200).json(specifications)
    }
    catch (error){
      console.log(error);
      res.status(505).json({error: 'Fetching Error'});
    }
  }

  /**
   * Handles POST requests.
   * Creates new test specifications for a part with detailed test parameters.
   *
   * @param {Object} req - The request object containing body parameters:
   * @param {string} req.body.pn - Part number.
   * @param {string} req.body.application - Application identifier.
   * @param {Object} req.body - Includes all other test parameters as key-value pairs.
   * @param {Object} res - The response object used to send back HTTP responses.
   */
  if (req.method === 'POST') {
    try{
      const { 
        pn,
        application,
        fixture,
        air_fixture,
        nominal_voltage,
        sort_file,
        graph_voltage,
        tube_qty_limit,
        is_shield_installed,
        is_diode_installed,
        contact_1_type,
        contact_2_type,
        contact_3_type,
        contact_4_type,
        atm,
        atm_max_time,
        buz,
        buz_cycles,
        buz_frequency,
        crs,
        crs_nom_resistance,
        crs_tolerance,
        dio,
        dcp,
        dcp_max_peak_to_peak,
        dcr,
        dcr_max_peak,
        dcr_start_measurment_window,
        dcr_window_width,
        dcr_sweeps,
        fbo,
        fbo_percent_overdrive,
        fbo_delay,
        irs,
        irs_range,
        irs_test_voltage,
        irs_delay,
        kel,
        ocu,
        ocu_max_current,
        ocu_min_current,
        otm,
        otm_max_time,
        vtd,
        vtd_min_differential,
        vtd_max_differential,
        vtr,
        vtr_max_percentage,
        vtr_min_percentage,
        ovt,
        ovt_max_voltage,
        ovt_min_voltage,
        ovt_delay,
        rcu,
        rcu_max_current,
        rcu_min_current,
        rtm,
        rtm_max_time,
        rvt,
        rvt_max_voltage,
        rvt_min_voltage,
        rvt_delay,
        scr,
        scr_max_resistance,
        scr_min_resistance,
        scr_delay,
        scs,
        scs_max_delta,
        scs_coil_voltage,
        scs_cycles,
        scs_warm_up,
        scs_delay,
        sho,
        sho_threshold_resistance,
        ttm,
        ttm_min_time,
        bvs,
        bvs_test_voltage,
        bvs_hi_lim,
        bvs_lo_lim,
        bvs_ramp_up,
        bvs_dwell_time,
        bvs_ramp_down,
        bvs_charge_lo
      } = req.body;
      
      const query = {
        data: {
          pn,
          application,
          revision: 1,
          revision_datetime: new Date(),
          fixture,
          air_fixture,
          nominal_voltage,
          sort_file,
          graph_voltage,
          tube_qty_limit,
          is_shield_installed,
          is_diode_installed,
          contact_1_type,
          contact_2_type,
          contact_3_type,
          contact_4_type,
          atm,
          atm_max_time,
          buz,
          buz_cycles,
          buz_frequency,
          crs,
          crs_nom_resistance,
          crs_tolerance,
          dio,
          dcp,
          dcp_max_peak_to_peak,
          dcr,
          dcr_max_peak,
          dcr_start_measurment_window,
          dcr_window_width,
          dcr_sweeps,
          fbo,
          fbo_percent_overdrive,
          fbo_delay,
          irs,
          irs_range,
          irs_test_voltage,
          irs_delay,
          kel,
          ocu,
          ocu_max_current,
          ocu_min_current,
          otm,
          otm_max_time,
          vtd,
          vtd_min_differential,
          vtd_max_differential,
          vtr,
          vtr_max_percentage,
          vtr_min_percentage,
          ovt,
          ovt_max_voltage,
          ovt_min_voltage,
          ovt_delay,
          rcu,
          rcu_max_current,
          rcu_min_current,
          rtm,
          rtm_max_time,
          rvt,
          rvt_max_voltage,
          rvt_min_voltage,
          rvt_delay,
          scr,
          scr_max_resistance,
          scr_min_resistance,
          scr_delay,
          scs,
          scs_max_delta,
          scs_coil_voltage,
          scs_cycles,
          scs_warm_up,
          scs_delay,
          sho,
          sho_threshold_resistance,
          ttm,
          ttm_min_time,
          bvs,
          bvs_test_voltage,
          bvs_hi_lim,
          bvs_lo_lim,
          bvs_ramp_up,
          bvs_dwell_time,
          bvs_ramp_down,
          bvs_charge_lo
        },
      };

      const specifications = await prisma.part_test_specifications.create(query);
      prisma.$disconnect();

      res.status(200).json(specifications);
    }
    catch (error){
      console.log(error)
      res.status(505).json({error});
    }
  }

   /**
   * Handles PATCH requests.
   * Updates existing test specifications for a given part number and application.
   * Automatically increments the revision number and updates the revision date and time.
   *
   * @param {Object} req - The request object containing body parameters:
   * @param {string} req.body.pn - Part number.
   * @param {string} req.body.application - Application identifier.
   * @param {number} req.body.revision - Current revision number to be incremented.
   * @param {Object} req.body - Includes all updated test parameters as key-value pairs.
   * @param {Object} res - The response object used to send back HTTP responses.
   */
  if (req.method === 'PATCH') {
    try{
      const { 
        pn,
        application,
        revision,
        fixture,
        air_fixture,
        nominal_voltage,
        sort_file,
        graph_voltage,
        tube_qty_limit,
        is_shield_installed,
        is_diode_installed,
        contact_1_type,
        contact_2_type,
        contact_3_type,
        contact_4_type,
        atm,
        atm_max_time,
        buz,
        buz_cycles,
        buz_frequency,
        crs,
        crs_nom_resistance,
        crs_tolerance,
        dio,
        dcp,
        dcp_max_peak_to_peak,
        dcr,
        dcr_max_peak,
        dcr_start_measurment_window,
        dcr_window_width,
        dcr_sweeps,
        fbo,
        fbo_percent_overdrive,
        fbo_delay,
        irs,
        irs_range,
        irs_test_voltage,
        irs_delay,
        kel,
        ocu,
        ocu_max_current,
        ocu_min_current,
        otm,
        otm_max_time,
        vtd,
        vtd_min_differential,
        vtd_max_differential,
        vtr,
        vtr_max_percentage,
        vtr_min_percentage,
        ovt,
        ovt_max_voltage,
        ovt_min_voltage,
        ovt_delay,
        rcu,
        rcu_max_current,
        rcu_min_current,
        rtm,
        rtm_max_time,
        rvt,
        rvt_max_voltage,
        rvt_min_voltage,
        rvt_delay,
        scr,
        scr_max_resistance,
        scr_min_resistance,
        scr_delay,
        scs,
        scs_max_delta,
        scs_coil_voltage,
        scs_cycles,
        scs_warm_up,
        scs_delay,
        sho,
        sho_threshold_resistance,
        ttm,
        ttm_min_time,
        bvs,
        bvs_test_voltage,
        bvs_hi_lim,
        bvs_lo_lim,
        bvs_ramp_up,
        bvs_dwell_time,
        bvs_ramp_down,
        bvs_charge_lo
      } = req.body;
      
      const query = {
        where: {
          pn_application: {
            pn,
            application
          }
        },
        data: {
          pn,
          application,
          revision: revision + 1,
          revision_datetime: new Date(),
          fixture,
          air_fixture,
          nominal_voltage,
          sort_file,
          graph_voltage,
          tube_qty_limit,
          is_shield_installed,
          is_diode_installed,
          contact_1_type,
          contact_2_type,
          contact_3_type,
          contact_4_type,
          atm,
          atm_max_time,
          buz,
          buz_cycles,
          buz_frequency,
          crs,
          crs_nom_resistance,
          crs_tolerance,
          dio,
          dcp,
          dcp_max_peak_to_peak,
          dcr,
          dcr_max_peak,
          dcr_start_measurment_window,
          dcr_window_width,
          dcr_sweeps,
          fbo,
          fbo_percent_overdrive,
          fbo_delay,
          irs,
          irs_range,
          irs_test_voltage,
          irs_delay,
          kel,
          ocu,
          ocu_max_current,
          ocu_min_current,
          otm,
          otm_max_time,
          vtd,
          vtd_min_differential,
          vtd_max_differential,
          vtr,
          vtr_max_percentage,
          vtr_min_percentage,
          ovt,
          ovt_max_voltage,
          ovt_min_voltage,
          ovt_delay,
          rcu,
          rcu_max_current,
          rcu_min_current,
          rtm,
          rtm_max_time,
          rvt,
          rvt_max_voltage,
          rvt_min_voltage,
          rvt_delay,
          scr,
          scr_max_resistance,
          scr_min_resistance,
          scr_delay,
          scs,
          scs_max_delta,
          scs_coil_voltage,
          scs_cycles,
          scs_warm_up,
          scs_delay,
          sho,
          sho_threshold_resistance,
          ttm,
          ttm_min_time,
          bvs,
          bvs_test_voltage,
          bvs_hi_lim,
          bvs_lo_lim,
          bvs_ramp_up,
          bvs_dwell_time,
          bvs_ramp_down,
          bvs_charge_lo
        },
      };

      const specifications = await prisma.part_test_specifications.update(query);
      prisma.$disconnect();

      res.status(200).json(specifications);
    }
    catch (error){
      console.log(error)
      res.status(505).json({error});
    }
  }
}