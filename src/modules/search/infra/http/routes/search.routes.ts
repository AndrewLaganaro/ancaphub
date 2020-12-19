import { Router } from 'express';

import SearchController from '../controllers/SearchController';

const searchRouter = Router();

const searchController = new SearchController();

// Search
searchRouter.get('/', searchController.index);

export default searchRouter;
