import FAQ from '../../models/FAQ.js';

// Get all FAQs
async function getAllFAQs(req, res) {
  try {
    const faqs = await FAQ.find({ isActive: true })
      .sort({ category: 1, order: 1 })
      .select('id question answer category');
    
    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

// Get all unique categories
async function getAllCategories(req, res) {
  try {
    // Use aggregation to get distinct categories
    const categories = await FAQ.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category' } },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories.map(item => item._id)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

// Get FAQs by category
async function getFAQsByCategory(req, res) {
  try {
    const { category } = req.params;
    
    const faqs = await FAQ.find({ 
      category, 
      isActive: true 
    })
    .sort({ order: 1 })
    .select('id question answer category');
    
    if (faqs.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No FAQs found for this category'
      });
    }
    
    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

// Get FAQs with categories grouped
async function getFAQsGroupedByCategory(req, res) {
  try {
    console.log("inside getFAQ")
    // First get all unique categories
    const categories = await FAQ.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category' } },
      { $sort: { _id: 1 } }
    ]);
    
    // For each category, get the FAQs
    const result = await Promise.all(
      categories.map(async (category) => {
        const faqs = await FAQ.find({ 
          category: category._id,
          isActive: true 
        })
        .sort({ order: 1 })
        .select('id question answer');
        
        return {
          category: category._id,
          items: faqs
        };
      })
    );
    
    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

export {
  getAllFAQs,
  getAllCategories,
  getFAQsByCategory,
  getFAQsGroupedByCategory
};