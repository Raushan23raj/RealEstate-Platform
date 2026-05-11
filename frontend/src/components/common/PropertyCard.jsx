import React from 'react'
import { propertyCardStyles } from '../../assets/dummyStyles'
import { useAuth } from '../../context/authcontext'
import { Link, useNavigate } from 'react-router-dom';

const PropertyCard = ({
      property,
      renderAction,
      isWhishlisted,
      onToggleWhishlist
}) => {
      if (!property) return null;

      const { user } = useAuth();
      const navigate = useNavigate();

      //for whishlist click(added to whishlist)
      const handleWhishlistClick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!user) {
                  navigate("/login");
                  return;
            }
            if (onToggleWhishlist) {
                  onToggleWhishlist(property._id);
            }
      };

      const formattedPrice = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
      }).format(property.price);

      const statusBadgeClass = s.badgeStatus(property.status);
      
  return (
        <div className={s.card}>
              <Link to={`/property/${property._id}`} className={s.link}>
                    <div className={s.imageSection}>
                          <img src="" alt=""/>
                    </div>
              </Link>   
      </div>
  )
}

export default PropertyCard