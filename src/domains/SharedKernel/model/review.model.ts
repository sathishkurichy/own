export type RecipeReviewOutDto = {
    id: number,
    user: string,
    avatar: string,
    comment: string,
    favorite: boolean,
    isParentReferent: boolean
}

export var defaultReview: RecipeReviewOutDto = {
    id: 0,
    user: 'user',
    avatar: 'assets/img/avatar-placeholder.jpg',
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    favorite: true,
    isParentReferent: false
}
