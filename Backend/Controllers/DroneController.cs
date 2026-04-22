using Business_Layer.Services;
using Data_Layer.ResourceModel.ViewModel.DroneVMs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("CorsPolicy")]
    // [Authorize(Roles = "Admin")] // Chỉ Admin mới có quyền quản lý Drone
    public class DroneController : ControllerBase
    {
        private readonly IDroneService _droneService;

        public DroneController(IDroneService droneService)
        {
            _droneService = droneService;
        }

        // GET: api/Drone/GetAll
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllDrones()
        {
            var result = await _droneService.GetAllDronesAsync();
            return Ok(result);
        }

        // POST: api/Drone/Add
        [HttpPost("Add")]
        public async Task<IActionResult> AddDrone([FromBody] DroneCreateVM model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _droneService.AddDroneAsync(model);
            return Ok(result);
        }

        // PUT: api/Drone/UpdateStatus/1
        [HttpPut("UpdateStatus/{id}")]
        public async Task<IActionResult> UpdateDroneStatus(int id, [FromBody] DroneUpdateStatusVM model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _droneService.UpdateDroneStatusAsync(id, model);
            if (!result.IsSuccess)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        // DELETE: api/Drone/Delete/1
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteDrone(int id)
        {
            var result = await _droneService.DeleteDroneAsync(id);
            if (!result.IsSuccess)
            {
                return NotFound(result);
            }
            return Ok(result);
        }
    }
}