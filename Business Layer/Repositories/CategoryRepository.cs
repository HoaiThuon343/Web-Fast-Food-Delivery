
using Business_Layer.DataAccess;
using Data_Layer.Models;

using Data_Layer.ResourceModel.ViewModel.Enum;
using Microsoft.EntityFrameworkCore;

namespace Business_Layer.Repositories
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        private readonly FastFoodDeliveryDBContext _dbContext;
        public CategoryRepository(FastFoodDeliveryDBContext context, FastFoodDeliveryDBContext dbContext) : base(context)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Category>> GetCategoryAll()
        {
            var categorylists = await _dbContext.Categories.Where(x => x.CategoriesStatus == CategoryStatusEnum.Active.ToString()).ToListAsync();
            return categorylists;
        }
        public async Task<int> GetTotalCategories()
        {
            var totalCategories = await _dbContext.Categories.Where(c => c.CategoriesStatus == "Active").CountAsync();
            return totalCategories;
        }
    }
}
