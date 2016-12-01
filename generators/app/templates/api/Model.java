package <%=packageName%>;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;

import java.util.List;
import java.util.Objects;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonDeserialize(builder = <%-classname%>.<%-classname%>Builder.class)
public class <%-classname%> {
    <%properties & Object.keys(properties).forEach(function (propertyName) { var property = properties[propertyName];%>private final <%-property.classType%> <%=propertyName%>;
    <%})%>

    private <%-classname%>(<%properties & Object.keys(properties).forEach(function (propertyName) { var property = properties[propertyName];%><%-property.classType%> <%=propertyName%><%if (!property.isLastProperty) {%>, <%}%><%})%>) {
        <%properties & Object.keys(properties).forEach(function (propertyName) { var property = properties[propertyName];%>this.<%=propertyName%> = <%=propertyName%>;
        <%})%>
    }

    <%properties & Object.keys(properties).forEach(function (propertyName) { var property = properties[propertyName];%>public <%-property.classType%> get<%=capitalize(propertyName)%>() {
      return <%=propertyName%>;
    }
    <%})%>


    @Override
    public int hashCode() {
        return Objects.hash(<%properties & Object.keys(properties).forEach(function (propertyName) { var property = properties[propertyName];%><%=propertyName%><%if (!property.isLastProperty) {%>, <%}%><%})%>);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        final <%-classname%> other = (<%-classname%>) obj;
        return <%properties & Object.keys(properties).forEach(function (propertyName) { var property = properties[propertyName];%>Objects.equals(this.<%=propertyName%>, other.<%=propertyName%>)<%if (!property.isLastProperty) {%> && <%} else {%>;<%}%>
                <%})%>
    }

    @Override
    public String toString() {
        return "<%-classname%>{" +
                <%properties & Object.keys(properties).forEach(function (propertyName) { var property = properties[propertyName];%>"<%=propertyName%>='" + <%=propertyName%> + "'<%if (!property.isLastProperty) {%>, <%}%>" +
                <%})%>'}';
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @JsonPOJOBuilder
    public static final class <%-classname%>Builder {
        <%properties & Object.keys(properties).forEach(function (propertyName) { var property = properties[propertyName];%>private <%-property.classType%> <%=propertyName%>;
        <%})%>

        private <%-classname%>Builder() {
        }

        public static <%-classname%>Builder a<%-classname%>() {
            return new <%-classname%>Builder();
        }

        <%properties & Object.keys(properties).forEach(function (propertyName) { var property = properties[propertyName];%>public <%-classname%>Builder with<%=capitalize(propertyName)%>(<%-property.classType%> <%=propertyName%>) {
          this.<%=propertyName%> = <%=propertyName%>;
          return this;
        }
        <%})%>

        public <%-classname%> build() {
            return new <%-classname%>(<%properties & Object.keys(properties).forEach(function (propertyName) { var property = properties[propertyName];%><%=propertyName%><%if (!property.isLastProperty) {%>, <%}%><%})%>);
        }
    }
}
