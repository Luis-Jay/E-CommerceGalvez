import { defineComponent, computed } from 'vue';

interface Rating {
  stars: number;
  count: number;
}

interface Product {
  ratings: Rating[];
}

export default defineComponent({
  name: 'CommentRating',
  props: {
    product: {
      type: Object as () => Product,
      required: true,
    },
  },
  emits: ['open-review-modal', 'view-all-reviews'],
  setup(props, { emit }) {
    const overallRating = computed(() => {
      const totalStars = props.product.ratings.reduce((sum, item) => {
        return sum + item.stars * item.count;
      }, 0);

      const totalReviews = props.product.ratings.reduce((sum, item) => {
        return sum + item.count;
      }, 0);

      return totalReviews > 0 ? (totalStars / totalReviews).toFixed(1) : '0';
    });

    const totalReviews = computed(() => {
      return props.product.ratings.reduce((sum, item) => sum + item.count, 0);
    });

    const openReviewModal = () => {
      emit('open-review-modal');
    };

    const viewAllReviews = () => {
      emit('view-all-reviews');
    };

    return {
      overallRating,
      totalReviews,
      openReviewModal,
      viewAllReviews,
    };
  },
});