import { Eye, Repeat, SuitHeart } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ImageLoader from "~/components/Image";
import ReviewCount from "~/components/Review/count";
import { postData, stockInfo } from "~/lib/clientFunctions";
import { updateComparelist, updateWishlist } from "~/redux/cart.slice";
import c from "./product.module.css";
import { useTranslation } from "react-i18next";

const Product = ({
  product,
  button,
  link,
  deleteButton,
  layout,
  border,
  hideLink,
  cssClass,
}) => {
  const { session } = useSelector((state) => state.localSession);
  const settings = useSelector((state) => state.settings);
  const { wishlist: wishlistState, compare: compareState } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Guard clause to prevent rendering if essential data is missing
  if (!product || !product.slug) {
    return null;
  }

  // Safe URL generation
  const productSlug = product.slug || '';
  const productUrl = productSlug ? `/product/${productSlug}` : '#';
  const galleryUrl = link || (productSlug ? `/gallery?slug=${productSlug}` : '#');
  const discountInPercent = product.price > 0 
    ? Math.round((100 - (product.discount * 100) / product.price) * 10) / 10
    : 0;

  function updateWishlistCount() {
    const __data = wishlistState ? wishlistState + 1 : 1;
    dispatch(updateWishlist(__data));
  }

  const addToWishList = async () => {
    try {
      if (!session) {
        return toast.warning("You need to login to create a Wishlist");
      }
      const data = {
        pid: product._id,
        id: session.user?.id,
      };
      const response = await postData(`/api/wishlist`, data);
      response.success
        ? (toast.success("Item has been added to wishlist"),
          updateWishlistCount())
        : response.exists
        ? toast.warning("This Item already exists on your wishlist")
        : toast.error("Something went wrong (500)");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const addToCompareList = () => {
    if (!product?._id) return;
    
    const pid = product._id;
    const exists = compareState?.find((x) => x === pid);
    if (exists) {
      toast.warning("This Item already exists on your compare list");
    } else {
      const __data = [...(compareState || []), pid];
      dispatch(updateComparelist(__data));
      toast.success("Item has been added to compare list");
    }
  };

  const ItemLayout = layout || "col-lg-3 col-md-4 col-6";

  return (
    <div className={`${c.item} ${ItemLayout}`}>
      <div
        className={`${c.card} ${border ? c.border : ""} ${
          cssClass || ""
        }`}
      >
        <div className={c.hover_buttons}>
          <button onClick={addToWishList} aria-label="Add to wishlist">
            <SuitHeart width={15} height={15} />
          </button>
          <button onClick={addToCompareList} aria-label="Add to compare">
            <Repeat width={15} height={15} />
          </button>
          {!hideLink && (
            <Link
              href={galleryUrl}
              as={productSlug ? `/product/${productSlug}` : '#'}
              scroll={false}
              shallow={true}
            >
              <button aria-label="View product details">
                <Eye width={15} height={15} />
              </button>
            </Link>
          )}
          {deleteButton}
        </div>
        <div>
          <Link href={productUrl}>
            <div className={c.container}>
              <ImageLoader
                src={product.image?.[0]?.url || ''}
                alt={product.name || 'Product image'}
                width={200}
                height={200}
                style={{ width: "100%", height: "auto" }}
                quality={100}
              />
            </div>
          </Link>
          {product.discount < product.price && (
            <div className={c.discount}>-{discountInPercent}%</div>
          )}
          <div className={c.nameContainer}>
            <ReviewCount reviews={product.review || []} showCount />
            <div className={c.name}>
              <Link href={productUrl}>
                {product.name || 'Product'}
              </Link>
            </div>
            {product.unitValue && product.unit && (
              <p className={c.unit}>{`${product.unitValue} ${product.unit}`}</p>
            )}
            <div className={c.price_con}>
              {product.discount < product.price && (
                <p className={c.price}>
                  {settings?.settingsData?.currency?.symbol || "Tk"}
                  {product.discount}
                </p>
              )}
              <p
                className={
                  product.discount < product.price ? c.price_ori : c.price
                }
              >
                {settings?.settingsData?.currency?.symbol || "Tk"}
                {product.price}
              </p>
            </div>
          </div>
          {button && (
            <div className={c.buttonContainer}>
              {stockInfo(product) ? (
                <Link
                  href={galleryUrl}
                  as={productSlug ? `/product/${productSlug}` : '#'}
                  scroll={false}
                  shallow={true}
                  className={c.button}
                >
                  {t("buy_now")}
                </Link>
              ) : (
                <button className={c.button} disabled>
                  {t("out_of_stock")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;