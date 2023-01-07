using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly DataContext _dbContext;
        public BuggyController(DataContext dbContext)
        {
            _dbContext = dbContext;
            
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return "secret test";
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {
            var thing = _dbContext.Users.Find(-1);

            if (thing == null) return NotFound();

            return thing;

        }

        [HttpGet("server-error")]
        public ActionResult<string> SetServerError()
        {
            var thing = _dbContext.Users.Find(-1);

            var thingToReturn = thing.ToString(); // causes server error

            return thingToReturn;
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetSeGetBadRequest()
        {
            return BadRequest("Bad request");
        }
    }
}