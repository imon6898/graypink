import Link from "next/link";
import { useSelector } from "react-redux";
import ImageLoader from "../Image";
import classes from "./productList.module.css";

function ProductCard(props) {
  const settings = useSelector((state) => state.settings);
  
  // Guard clause to prevent rendering if essential data is missing
  if (!props.data || !props.data.slug) {
    return null;
  }

  const productSlug = props.data.slug || '';
  const productUrl = productSlug ? `/product/${productSlug}` : '#';
  const galleryUrl = productSlug ? `/?slug=${productSlug}` : '#';
  
  const priceDetails = () => {
    if (!props.data) return '';
    
    const { price, discount } = props.data;
    const currency = settings?.settingsData?.currency?.symbol || 'Tk';
    
    if (discount < price) {
      return (
        <>
          <span className={classes.price}>
            {currency}
            {discount}
          </span>
          <span className={classes.original_price}>
            {currency}
            {price}
          </span>
        </>
      );
    }
    
    return (
      <span className={classes.price}>
        {currency}
        {price}
      </span>
    );
  };

  return (
    <div className={classes.page_wrapper}>
      <div className={classes.page_inner}>
        <div className={classes.row}>
          <div className={classes.el_wrapper}>
            <Link href={productUrl}>
              <div className={classes.box_up}>
                <div className={classes.img}>
                  <ImageLoader
                    className={classes.image}
                    src={props.data.image?.[0]?.url || ''}
                    alt={props.data.name || 'Product'}
                    width={250}
                    height={250}
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </div>
                <div className={classes.img_info}>
                  <div className={classes.info_inner}>
                    <span className={classes.p_name}>{props.data.name || 'Product'}</span>
                    {props.data.unitValue && props.data.unit && (
                      <span className={classes.p_company}>
                        {`${props.data.unitValue} ${props.data.unit}`}
                      </span>
                    )}
                  </div>
                  <div className={classes.a_size}>
                    <span className={classes.size}>{priceDetails()}</span>
                  </div>
                </div>
              </div>
            </Link>
            <div className={classes.box_down}>
              <div className={classes.h_bg}>
                <div className={classes.h_bg_inner}></div>
              </div>
              <Link
                href={galleryUrl}
                as={productSlug ? `/product/${productSlug}` : '#'}
                scroll={false}
                shallow={true}
                className={classes.cart}
              >
                <span className={classes.add_to_cart}>
                  <span className={classes.txt}>Add to cart</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
