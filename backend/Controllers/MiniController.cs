using BACKEND.Models;
using BACKEND.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MiniController : ControllerBase
    {
        private readonly IMiniRepository _repository;

        public MiniController(IMiniRepository repository)
        {
            _repository = repository;
        }

        // GET: api/mini
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MiniItem>>> GetAll()
        {
            var items = await _repository.GetAllAsync();
            return Ok(items);
        }

        // GET: api/mini/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MiniItem>> GetById(int id)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null)
                return NotFound();

            return Ok(item);
        }

        // POST: api/mini
        [HttpPost]
        public async Task<ActionResult> Add(MiniItem item)
        {
            await _repository.AddAsync(item);
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        // PUT: api/mini/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, MiniItem item)
        {
            if (id != item.Id)
                return BadRequest("Item ID mismatch");

            await _repository.UpdateAsync(item);
            return NoContent();
        }

        // PATCH: api/mini/{id}/bought
        [HttpPatch("{id}/bought")]
        public async Task<ActionResult> MarkAsBought(int id)
        {
            await _repository.MarkAsBoughtAsync(id);
            return NoContent();
        }

        // DELETE: api/mini/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}
